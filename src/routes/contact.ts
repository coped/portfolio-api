import express from "express";
const router = express.Router();

/* POST contact message */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

export { router };
