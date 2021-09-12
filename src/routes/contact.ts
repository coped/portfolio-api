import type { Request, Response } from "express";
import { Router } from "express";
import { SendEmailCommand, SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { sesClient } from "../libs/sesClient.js";
import { hasOwnProperty, jsonError, jsonMessage } from "../utils/utils.js";
import { verifyRecaptcha } from "../utils/requestLibrary.js";
import { ResponseText, ENV } from "../utils/constants.js";

const router = Router();

const REQUIRED_FIELDS: string[] = ["name", "email", "message", "token"];

/**
 * POST contact message
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  let hasFields = true;
  const missingFields: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!hasOwnProperty(req.body, field)) {
      hasFields = false;
      missingFields.push(field);
    }
  });

  // Validate that we have the required fields
  if (!hasFields) {
    res
      .status(400)
      .json(
        jsonError(
          `${ResponseText.REQUEST_FIELDS_MISSING}: ${missingFields.join(", ")}`
        )
      );
    return;
  }

  // Validate the reCAPTCHA response token
  const { data } = await verifyRecaptcha(req.body.token);

  // Validate that the request was successful
  if (!data || !data.success) {
    res.status(500).json(jsonError(ResponseText.RECAPTCHA_SERVICE_FAIL));
    return;
  }

  // Validate the score was high enough
  if (data.score < 0.5) {
    res.status(400).json(jsonError(ResponseText.RECAPTCHA_VERIFY_FAIL));
    return;
  }

  // Return dummy content if in development
  if (process.env.NODE_ENV === ENV.DEVELOPMENT) {
    res.status(200).json(jsonMessage(ResponseText.DEVELOPMENT_SUCCESS));
    return;
  }

  // Set up email configs
  const message = `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`;
  // Set the parameters
  const params = {
    Destination: {
      /* required */
      ToAddresses: ["dennisaaroncope@gmail.com"],
    },
    Message: {
      /* required */
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Message from coped.dev!",
      },
    },
    Source: "noreply@coped.dev", // SENDER_ADDRESS
  };

  // Send the message
  const run = async (): Promise<SendEmailCommandOutput | unknown> => {
    try {
      const sesResponse = await sesClient.send(new SendEmailCommand(params));
      console.log("Success", sesResponse);
      res.sendStatus(200);
      return sesResponse; // For unit tests.
    } catch (err) {
      console.log("Error", err);
      res.sendStatus(503);
      return err;
    }
  };
  run();
});

export { router };
