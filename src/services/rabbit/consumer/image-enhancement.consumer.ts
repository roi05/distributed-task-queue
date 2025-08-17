import logger from "../../../utils/logger";
import { getChannel } from "../../../utils/rabbitmq";

export async function imageEnhancemenConsumer() {
  const channel = getChannel();
  const queue = "image_jobs";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      logger.info("Processing image job:", data);

      // 👉 process the job here...
      channel.ack(msg);
    }
  });
}
