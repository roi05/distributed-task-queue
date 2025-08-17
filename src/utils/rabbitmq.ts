import amqp from "amqplib";
import logger from "./logger";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672",
  );
  channel = await connection.createChannel();
  logger.info("✅ Connected to RabbitMQ");
}

export function getChannel(): amqp.Channel {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}
