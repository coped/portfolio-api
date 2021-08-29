import { Router } from "express";
import type { Request, Response } from "express";
import { SendEmailCommand, SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { sesClient } from "../libs/sesClient";

const router = Router();

/**
 * POST contact message
 */
router.post("/", (req: Request, res: Response): void => {
  // Ensure we're working with valid fields
  const missingFields = ["name", "email", "message"].reduce(
    (fields: string[], field: string): string[] => {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) {
        return [...fields, field];
      }
      return fields;
    },
    []
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      error: `Missing required field(s): ${missingFields.join(", ")}`,
    });
  } else {
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

    const run = async (): Promise<void | SendEmailCommandOutput> => {
      try {
        const data = await sesClient.send(new SendEmailCommand(params));
        console.log("Success", data);
        res.sendStatus(200);
        return data; // For unit tests.
      } catch (err) {
        res.sendStatus(503);
        console.log("Error", err);
      }
    };
    run();
  }
});

export { router };
