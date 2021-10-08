import type { Response } from "node-fetch";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import fetch, { Response as ResponseObject } from "node-fetch";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../libs/sesClient.js";
import { MimeTypes, ExternalUrls } from "./constants.js";

/**
 * Generic request handler
 */
const handleRequest = async (f: () => Promise<Response>): Promise<Response> => {
  try {
    return await f();
  } catch (e: unknown) {
    return ResponseObject.error();
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
    fetch(ExternalUrls.RECAPTCHA_VERIFY, {
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
    return new ResponseObject(JSON.stringify(data));
  } catch (e: unknown) {
    return ResponseObject.error();
  }
};
