import logger from "../../utils/logger";
import { getChannel } from "../../utils/rabbitmq";

export async function publishToQueue(queue: string, message: object) {
  const channel = getChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  logger.info(`Job enqueued to [${queue}]:`, message);
}
