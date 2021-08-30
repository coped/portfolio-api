import type { Request, Response } from "express";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { router as indexRouter } from "./routes/index";
import { router as contactRouter } from "./routes/contact";
import { ENV } from "./utils/constants";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/contact", contactRouter);

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
  res.json({ error: err });
});

export { app };
