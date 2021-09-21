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

const router = Router();

interface RecaptchaData {
  score: number;
}
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
  const verifyRes = await verifyRecaptcha(req.body.token);
  if (!verifyRes.ok) {
    res.status(503).json(jsonError(ResponseText.RECAPTCHA_SERVICE_FAIL));
    return;
  }

  // Validate reCAPTCHA score was high enough
  const { score } = (await verifyRes.json()) as RecaptchaData;
  if (score < 0.5) {
    res.status(400).json(jsonError(ResponseText.RECAPTCHA_VERIFY_FAIL));
    return;
  }

  // Return dummy response in development, to preserve precious AWS quota
  if (process.env.NODE_ENV !== ENV.PRODUCTION) {
    res.status(200).json(jsonMessage(ResponseText.DEVELOPMENT_SUCCESS));
    return;
  }

  // Send the email
  const message = `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`;
  const emailRes = await sendAWSEmail(emailParams(message));
  if (!emailRes.ok) {
    res.status(503).json(jsonError(ResponseText.AWS_SERVICE_FAIL));
    return;
  }

  res.sendStatus(200);
});

export { router };
