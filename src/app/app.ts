import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import routeNotFoundHandler from "./middlewares/routeNotFoundHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://10.10.28.34:3000",
      "https://b5ff-103-159-73-203.ngrok-free.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
  res.send("Dendalar server is running! 🚀");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(routeNotFoundHandler);

export default app;
