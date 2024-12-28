import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./configs/db";
import xss from "xss-clean";
import { authRoutes } from "./routes/auth.routes";
import globalErrorHandler from "./controllers/error.controller";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

// configs
dotenv.config();
app.use(express.json({ limit: "100kb" }));
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 1000,
  message: "Too many requests, please try again in after 1 minute!",
});
app.use("/api", limiter);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(globalErrorHandler);

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
