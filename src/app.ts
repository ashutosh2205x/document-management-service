import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./configs/db";
import xss from "xss-clean";
import globalErrorHandler from "./controllers/error.controller";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { authRoutes } from "./routes/auth.routes";
import { documentRoutes } from "./routes/document.routes";
import { userRoutes } from "./routes/user.routes";
import { ingestionRoutes } from "./routes/ingestion.routes";
import { setupSwagger } from "./configs/swagger";
import { populateBloomFilter } from "./utils/bloomFilterInstance";
import { metricsRoutes } from "./routes/metrics.route";
import metricsMiddleware from "./middlewares/metrics.m";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());
app.use(metricsMiddleware);

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
app.use("/api/documents", documentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ingestion", ingestionRoutes);

app.use("/api", metricsRoutes);



setupSwagger(app);
app.use(globalErrorHandler);

sequelize.sync().then(async () => {
  console.log("DB connected...");
  populateBloomFilter()
  .then(() => console.log("Bloom filter populated with existing emails"))
  .catch((error) => console.error("Error populating Bloom filter:", error));
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(e=>{
  console.log("error while connecting to DB..", e);
  process.exit()
});
