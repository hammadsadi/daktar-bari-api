import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";

// Init Express
const app: Application = express();

// Parser
app.use(express.json());
// app.use(bod)
app.use(express.urlencoded({ extended: true }));

// Cors Init
app.use(cors());

// Api Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Daktar Bari Server Successfully Connected...🤗",
  });
});

// Routes
app.use("/api/v1", router);
export default app;
