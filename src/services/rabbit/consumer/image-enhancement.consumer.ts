import { IMAGE_OPERATION } from "../../../types/image/image-operation";
import { getChannel } from "../../../utils/rabbitmq";
import { ImageJob } from "../../../types/image/image-job";
import logger from "../../../utils/logger";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { updateJob } from "../../jobs.service";

export async function imageEnhancementConsumer() {
  const channel = getChannel();
  const queue = "image_jobs";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const job: ImageJob = JSON.parse(msg.content.toString());
    updateJob(job.id, { status: "processing" });
    logger.info(`📥 Processing image job ${job.id}`, job);

    try {
      // Download the image
      const response = await fetch(job.imageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      let image = sharp(buffer);

      // Apply operations
      for (const op of job.operations) {
        switch (op) {
          case IMAGE_OPERATION.RESIZE:
            image = image.resize(300, 300);
            break;
          case IMAGE_OPERATION.COMPRESS:
            image = image.jpeg({ quality: 70 });
            break;
          case IMAGE_OPERATION.GRAYSCALE:
            image = image.grayscale();
            break;
          case IMAGE_OPERATION.ROTATE:
            image = image.rotate(90);
            break;
          case IMAGE_OPERATION.CROP:
            image = image.extract({ left: 0, top: 0, width: 200, height: 200 });
            break;
          case IMAGE_OPERATION.BLUR:
            image = image.blur(5);
            break;
        }
      }

      const FILE_PATH = path.join(process.cwd(), "image-output");

      // Save output (later you could upload to S3, etc.)
      const outputPath = `${FILE_PATH}/${job.id}.jpg`;
      await fs.promises.mkdir(FILE_PATH, { recursive: true });
      await image.toFile(outputPath);

      updateJob(job.id, { status: "done", resultUrl: outputPath });

      logger.info(`✅ Job ${job.id} completed → ${outputPath}`);
      channel.ack(msg);
    } catch (error) {
      logger.error(`❌ Job ${job.id} failed:`, error);
      channel.nack(msg, false, true); // requeue the message
    }
  });

  logger.info(`👷 Worker waiting for jobs in "${queue}"...`);
}
