import { imageEnhancementConsumer } from "./consumer/image-enhancement.consumer";

export async function startConsumers() {
  await imageEnhancementConsumer();
}
