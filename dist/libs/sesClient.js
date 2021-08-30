"use strict";
exports.__esModule = true;
exports.sesClient = void 0;
var client_ses_1 = require("@aws-sdk/client-ses");
// Create SES service object.
var sesClient = new client_ses_1.SESClient({ region: "us-west-2" });
exports.sesClient = sesClient;
