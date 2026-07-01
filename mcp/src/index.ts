#!/usr/bin/env node
import { config } from "dotenv";
config({ path: "../.env" });

import { startServer } from "./server/index.js";
import { logger } from "@servicenow-impact/shared";

async function main(): Promise<void> {
  try { await startServer(); }
  catch (error) {
    logger.error("Fatal error starting MCP server", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
}
main();
