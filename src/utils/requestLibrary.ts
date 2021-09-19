import type { Response } from "node-fetch";
import type {
  SendEmailCommandInput,
  SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import fetch, { Response as FetchResponse } from "node-fetch";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../libs/sesClient.js";

const handleRequest = async <T = Response>(
  f: () => Promise<T>
): Promise<T | Response> => {
  try {
    return await f();
  } catch (e: unknown) {
    return FetchResponse.error();
  }
};

/**
 * Verify Google reCAPTCHA tokens
 */
export const verifyRecaptcha = (token: string) => {
  const body = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY || "",
    response: token,
  });

  const request = () =>
    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: body.toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

  return handleRequest(request);
};

/**
 * Send email using AWS SES email client
 */
export const sendAWSEmail = (params: SendEmailCommandInput) => {
  const request = () => sesClient.send(new SendEmailCommand(params));

  return handleRequest<SendEmailCommandOutput>(request);
};
