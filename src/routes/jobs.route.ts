import { Router } from "express";
import { publishToQueue } from "../services/rabbit/publisher";
import { IMAGE_OPERATION } from "../types/image/image-operation";
import { ImageJob } from "../types/image/image-job";
import crypto from "crypto";
import { getJob, saveJob } from "../services/jobs.service";

const router = Router();

router.get("/:id", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.post("/", async (req, res) => {
  const { imageUrl, operations } = req.body;

  if (!imageUrl || !operations) {
    return res.status(400).json({ error: "imageUrl and operations are required" });
  }

  if (!imageUrl || !operations || !Array.isArray(operations) || operations.length < 1) {
    return res.status(400).json({ error: "imageUrl and operations[] are required" });
  }

  const validOps = operations.filter((op: string) =>
    Object.values(IMAGE_OPERATION).includes(op as IMAGE_OPERATION),
  );

  if (validOps.length === 0) {
    return res.status(400).json({ error: "No valid operations provided" });
  }

  const id = crypto.randomUUID();
  const date = new Date()

  const job: ImageJob = {
    id: id,
    imageUrl,
    operations,
    status: 'queued',
    createdAt: date,
    updatedAt: date,
  };

  saveJob(job);

  publishToQueue("image_jobs", job);

  res.json({ message: "Job accepted", jobId: job.id });
});

export default router;
