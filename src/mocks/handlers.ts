import { rest } from "msw";
import { ExternalUrls } from "../utils/constants.js";

type RecaptchaVerifyRes = {
  secret: string;
  response: string;
};

export const handlers = [
  rest.post(ExternalUrls.RECAPTCHA_VERIFY, (req, res, ctx) => {
    const { secret, response } = req.body as RecaptchaVerifyRes;

    if (!secret || !response || response === "BAD_REQUEST") {
      return res(ctx.status(400), ctx.json({ success: false }));
    }

    return res(ctx.status(200), ctx.json({ success: true, score: 0.9 }));
  }),
];
