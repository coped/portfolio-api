import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

/**
 * POST contact message
 */
router.post("/", (req: Request, res: Response): void => {
  // Ensure we're working with valid fields
  const missingFields = ["name", "email", "message"].reduce(
    (fields: string[], field: string): string[] => {
      if (!req.body.hasOwnProperty(field)) {
        return [...fields, field];
      } else {
        return fields;
      }
    },
    []
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      error: `Missing required field(s): ${missingFields.join(", ")}`,
    });
    return;
  } else {
    // Handle emailing.
    res.sendStatus(200);
  }
});

export { router };
