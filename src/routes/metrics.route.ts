import express from "express";
import client from "prom-client";

const router = express.Router();

router.get("/metrics", (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(client.register.metrics());
});

export { router as metricsRoutes };
