import { imageEnhancemenConsumer } from "./consumer/image-enhancement.consumer";

export async function startConsumers() {
  await imageEnhancemenConsumer();
}
