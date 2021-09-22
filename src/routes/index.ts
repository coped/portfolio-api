import type { Request, Response } from "express";
import { Router } from "express";
import { jsonMessage } from "../utils/utils.js";
import { Text } from "../utils/constants.js";

const router = Router();

/**
 * GET index response
 */
router.get("/", (req: Request, res: Response): void => {
  res.json(jsonMessage(Text.INDEX_GREETING));
});

export { router };
