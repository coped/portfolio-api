import type { AxiosResponse } from "axios";
import axios from "axios";

type RecaptchaResponse = { success: boolean; score: number };

const handleRequest = async <T>(
  f: () => Promise<AxiosResponse>
): Promise<AxiosResponse<T | null>> => {
  try {
    return await f();
  } catch (e: unknown) {
    return {
      data: null,
      status: 500,
      statusText: "Error",
      headers: null,
      config: {},
    };
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
    axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      body.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

  return handleRequest<RecaptchaResponse>(request);
};
