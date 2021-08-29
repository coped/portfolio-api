import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

/**
 * GET index response
 */
router.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello, world!" });
});

export { router };
