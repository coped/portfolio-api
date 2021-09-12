export enum ENV {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum ResponseText {
  RECAPTCHA_SERVICE_FAIL = "An error occurred while contacting reCAPTCHA services",
  RECAPTCHA_VERIFY_FAIL = "reCAPTCHA verification failed",
  REQUEST_FIELDS_MISSING = "Request is missing required field(s)",
  INDEX_GREETING = "Hello, world!",
  DEVELOPMENT_SUCCESS = "This is a successful dummy response from the API in development mode.",
}
