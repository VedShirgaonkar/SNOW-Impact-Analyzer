#!/usr/bin/env tsx
import { config } from "dotenv";
config({ path: "../.env" });

import express from "express";
import cors from "cors";
import { loadConfig, logger } from "@servicenow-impact/shared";
import { analyzeRoute, configRoute, statusRoute } from "./api/routes.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

function createApp(): express.Application {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use((req, _res, next) => { logger.info(`${req.method} ${req.path}`, { query: req.query, ip: req.ip }); next(); });

  app.post("/api/analyze", analyzeRoute);
  app.get("/api/config", configRoute);
  app.get("/api/status", statusRoute);
  app.get("/api/health", (_req, res) => { res.json({ status: "ok", timestamp: new Date().toISOString(), version: "2.1.0" }); });

  app.use((_req, res) => { res.status(404).json({ error: "Not found" }); });
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error("Unhandled error", { error: err.message });
    res.status(500).json({ error: "Internal server error", message: "An unexpected error occurred." });
  });
  return app;
}

async function main(): Promise<void> {
  try {
    loadConfig();
    const app = createApp();
    app.listen(PORT, () => {
      logger.info(`API server running on http://localhost:${PORT}`);
      console.log("");
      console.log("  ╔══════════════════════════════════════════════════╗");
      console.log("  ║   ServiceNow Impact Analysis — API Server       ║");
      console.log("  ╚══════════════════════════════════════════════════╝");
      console.log("");
      console.log(`  API:        http://localhost:${PORT}`);
      console.log(`  Health:     http://localhost:${PORT}/api/health`);
      console.log(`  Status:     http://localhost:${PORT}/api/status`);
      console.log(`  Analyze:    POST http://localhost:${PORT}/api/analyze`);
      console.log("");
    });
  } catch (error) {
    logger.error("Failed to start API server", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
}
main();
