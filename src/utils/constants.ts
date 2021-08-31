export enum ENV {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export const PATHS: Record<string, string> = {
  FRONTEND_DEV: "http://localhost:3000/",
  FRONTEND_PROD: "https://coped.dev",
};

export const URLS: Record<string, URL> = Object.fromEntries(
  Object.entries(PATHS).map(([k, v]) => [k, new URL(v)])
);
