export enum ENV {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum Text {
  RECAPTCHA_SERVICE_FAIL = "An error occurred while attempting to contact reCAPTCHA services",
  RECAPTCHA_VERIFY_FAIL = "reCAPTCHA verification failed",
  RECAPTCHA_RESPONSE_FAIL = "reCAPTCHA returned an unsuccessful API response",
  AWS_SERVICE_FAIL = "An error occurred while attempting to contact AWS services",
  REQUEST_FIELDS_MISSING = "Request is missing required field(s)",
  INDEX_GREETING = "Hello, world!",
  DEVELOPMENT_SUCCESS = "This is a successful dummy response from the API in development mode",
}

export enum MimeTypes {
  JSON = "application/json",
  URL_ENCODED = "application/x-www-form-urlencoded",
}

export enum ExternalUrls {
  RECAPTCHA_VERIFY = "https://www.google.com/recaptcha/api/siteverify",
}
