import { Request, Response, NextFunction } from "express";
import { httpRequestDuration, totalRequests } from "../services/monitoring";

const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer();
  const route = req.route ? req.route.path : req.url;

  // Increment total requests counter
  totalRequests.inc({ method: req.method, route });

  res.on("finish", () => {
    const statusCode = res.statusCode;
    end({ method: req.method, route, status_code: statusCode.toString() });
  });

  next();
};

export default metricsMiddleware;
