import "dotenv/config";
import Express, { json, Request, Response, NextFunction } from "express";
import { Errors, MyError } from "./constants/errors";
import cors from "cors";
import agentRoutes from "./routes/agent";
import swapRoutes from "./routes/swaps";

const app = Express();
app.use(cors());
app.use(json());
const port = process.env.PORT;
if (!port) {
  console.log("Set PORT in env variables");
  throw new MyError(Errors.INVALID_SETUP);
}
//API Routes
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/swaps", swapRoutes);
// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err);
  // Handle known errors
  if (err instanceof Error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
