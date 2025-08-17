import { Router } from "express";
import { publishToQueue } from "../services/rabbit/publisher";

const router = Router();

router.post("/", async (req, res) => {
  const { imageUrl, operations } = req.body;

  if (!imageUrl || !operations) {
    return res.status(400).json({ error: "imageUrl and operations are required" });
  }

  const job = {
    id: Date.now(), // later replace with UUID
    imageUrl,
    operations, // e.g., ["resize", "compress"]
    status: "queued",
    createdAt: new Date(),
  };

  publishToQueue("image_jobs", job);

  res.json({ message: "Job accepted", jobId: job.id });
});

export default router;
