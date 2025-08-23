import { jobs } from "../repository/images.repository";
import { ImageJob } from "../types/image/image-job";

export function saveJob(job: ImageJob) {
  jobs.set(job.id, job);
}

export function updateJob(id: string, updates: Partial<ImageJob>) {
  const job = jobs.get(id);
  if (!job) return;
  jobs.set(id, { ...job, ...updates, updatedAt: new Date() });
}

export function getJob(id: string) {
  return jobs.get(id);
}
