import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./configs/db";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorHandler from "../../src/controllers/error.controller";
import { authRoutes } from "./routes/auth.routes";
import { populateBloomFilter } from "./utils/utilities";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/api/auth", authRoutes);


populateBloomFilter()
  .then(() => console.log("Bloom filter populated with existing emails"))
  .catch((error) => console.error("Error populating Bloom filter:", error));

app.use(globalErrorHandler);

sequelize.sync().then(async () => {
  console.log("DB connected...");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
