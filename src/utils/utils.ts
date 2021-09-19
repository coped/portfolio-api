import type { SendEmailCommandInput } from "@aws-sdk/client-ses";

export const hasOwnProperty = (obj: unknown, field: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, field);
};

export const jsonError = (s: string): { error: string } => ({
  error: s,
});

export const jsonMessage = (s: string): { message: string } => ({
  message: s,
});

export const emailParams = (message: string): SendEmailCommandInput => {
  return {
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
};
