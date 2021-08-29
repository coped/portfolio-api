import { SESClient } from "@aws-sdk/client-ses";

// Create SES service object.
const sesClient = new SESClient({ region: "us-west-2" });

export { sesClient };
