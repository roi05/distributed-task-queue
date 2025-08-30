import express from "express";
import jobsRouter from "./routes/jobs.route";
import path from "path";

const app = express();

const FILE_PATH = path.join(process.cwd(), "image-output");

// Serve images from the "image-output" folder
app.use("/image-output", express.static(FILE_PATH));


app.use(express.json());

app.use("/jobs", jobsRouter);

export default app;
