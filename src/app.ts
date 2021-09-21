import type { Request, Response } from "express";
import type { CorsOptions } from "cors";
import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { router as index } from "./routes/index.js";
import { router as contact } from "./routes/contact.js";
import { ENV } from "./utils/constants.js";
import { jsonError } from "./utils/utils.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure CORS options
const corsOptions: CorsOptions = {
  origin: "*", // Allowing all origins, temporarily
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Define route handlers
app.use("/", index);
app.use("/contact", contact);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response): void => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === ENV.DEVELOPMENT ? err : {};

  // show a generic error message
  res.status(err.status || 500);
  res.json(jsonError(err));
});

export { app };
