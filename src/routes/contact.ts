import type { Request, Response } from "express";
import { Router } from "express";
import {
  hasOwnProperty,
  jsonError,
  jsonMessage,
  emailParams,
} from "../utils/utils.js";
import { sendAWSEmail, verifyRecaptcha } from "../utils/requestLibrary.js";
import { ResponseText, ENV } from "../utils/constants.js";

interface RecaptchaData {
  score: number;
}

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
  verifyRecaptcha(req.body.token)
    .then((response) => response.json())
    .then((data: unknown) => {
      const { score } = data as RecaptchaData;
      // Validate the score was high enough
      if (score > 0.5) {
        // Return dummy content if in development
        if (process.env.NODE_ENV === ENV.PRODUCTION) {
          const message = `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`;
          sendAWSEmail(emailParams(message))
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(503));
        } else {
          res.status(200).json(jsonMessage(ResponseText.DEVELOPMENT_SUCCESS));
        }
      } else {
        res.status(400).json(jsonError(ResponseText.RECAPTCHA_VERIFY_FAIL));
      }
    })
    .catch(() =>
      res.status(500).json(jsonError(ResponseText.RECAPTCHA_SERVICE_FAIL))
    );
});

export { router };
