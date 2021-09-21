import type { Response } from "node-fetch";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import fetch, { Response as FetchResponse } from "node-fetch";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../libs/sesClient.js";
import { MimeTypes } from "./constants.js";

/**
 * Generic request handler
 */
const handleRequest = async (f: () => Promise<Response>): Promise<Response> => {
  try {
    return await f();
  } catch (e: unknown) {
    return FetchResponse.error();
  }
};

/**
 * Verify Google reCAPTCHA tokens
 */
export const verifyRecaptcha = (token: string): Promise<Response> => {
  const body = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY || "",
    response: token,
  });

  const request = () =>
    fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: body.toString(),
      headers: { "Content-Type": MimeTypes.URL_ENCODED },
    });

  return handleRequest(request);
};

/**
 * Send email using AWS SES email client
 */
export const sendAWSEmail = async (
  params: SendEmailCommandInput
): Promise<Response> => {
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    return new FetchResponse(JSON.stringify(data));
  } catch (e: unknown) {
    return FetchResponse.error();
  }
};
