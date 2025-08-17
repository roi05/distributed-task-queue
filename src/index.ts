import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";
import { connectRabbitMQ } from "./utils/rabbitmq";
import { startConsumers } from "./services/rabbit/consumers";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectRabbitMQ();
  await startConsumers();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
