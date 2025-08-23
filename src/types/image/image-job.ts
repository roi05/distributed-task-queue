// types.ts
import { IMAGE_OPERATION } from "./image-operation";
import { ImageStatus } from "./image-status";

export interface ImageJob {
  id: string;
  imageUrl: string;
  operations: IMAGE_OPERATION[];
  status: ImageStatus;
  createdAt: Date;
  updatedAt: Date;
  resultUrl?: string; // e.g., path to processed file
  error?: string;
}
