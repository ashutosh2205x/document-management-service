import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Histogram of HTTP request durations in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5], // Customize these buckets as needed
});

// Increment counter for total requests
const totalRequests = new client.Counter({
  name: "http_total_requests",
  help: "Counter for total HTTP requests",
  labelNames: ["method", "route"],
});

export { httpRequestDuration, totalRequests };
