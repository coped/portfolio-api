import type { Request, Response } from "express";
import { Router } from "express";
import {
  hasOwnProperty,
  jsonError,
  jsonMessage,
  emailParams,
} from "../utils/utils.js";
import { sendAWSEmail, verifyRecaptcha } from "../utils/requestLibrary.js";
import { Text, ENV } from "../utils/constants.js";

const router = Router();

interface RecaptchaData {
  success: boolean;
  score: number;
}

const REQUIRED_FIELDS: string[] = ["name", "email", "message", "token"];

/**
 * POST /contact
 * Handles sending contact message via email
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
        jsonError(`${Text.REQUEST_FIELDS_MISSING}: ${missingFields.join(", ")}`)
      );
    return;
  }

  // Validate the reCAPTCHA response token
  const verifyRes = await verifyRecaptcha(req.body.token);
  if (!verifyRes.ok) {
    res.status(503).json(jsonError(Text.RECAPTCHA_SERVICE_FAIL));
    return;
  }

  const captchaData = (await verifyRes.json()) as {
    success: boolean;
  };

  if (!captchaData.success) {
    res.status(500).json(jsonError(Text.RECAPTCHA_RESPONSE_FAIL));
    return;
  }

  // Validate reCAPTCHA score was high enough
  const { score } = captchaData as RecaptchaData;
  if (score < 0.5) {
    res.status(400).json(jsonError(Text.RECAPTCHA_VERIFY_FAIL));
    return;
  }

  // Return dummy response in development, to preserve precious AWS quota
  if (process.env.NODE_ENV !== ENV.PRODUCTION) {
    res.status(200).json(jsonMessage(Text.DEVELOPMENT_SUCCESS));
    return;
  }

  // Send the email
  const message = `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`;
  const emailRes = await sendAWSEmail(emailParams(message));
  if (!emailRes.ok) {
    res.status(503).json(jsonError(Text.AWS_SERVICE_FAIL));
    return;
  }

  res.sendStatus(200);
});

export { router };
