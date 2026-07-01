#!/usr/bin/env tsx
import { config } from "dotenv";
config({ path: "../.env" });
import { loadConfig, getServiceNowConfig, ServiceNowClient, ImpactAnalyzer, parseField, formatAsJson, formatAsMarkdown } from "@servicenow-impact/shared";

async function main() {
  const fieldInput = process.argv[2] || "incident.assignment_group";
  const format = (process.argv[3] || "markdown") as "json" | "markdown";
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   ServiceNow Impact Analysis — Direct Test      ║");
  console.log("╚══════════════════════════════════════════════════╝\n");
  console.log(`  Field:  ${fieldInput}\n  Format: ${format}\n`);
  try {
    loadConfig(); const snConfig = getServiceNowConfig(); const field = parseField(fieldInput);
    console.log(`  Instance: ${snConfig.instanceUrl}\n  User:     ${snConfig.username}\n\n  Querying ServiceNow...\n`);
    const client = new ServiceNowClient(snConfig);
    const result = await new ImpactAnalyzer(client).analyze(field);
    console.log("=".repeat(60) + "\n");
    console.log(format === "markdown" ? formatAsMarkdown(result) : formatAsJson(result));
    console.log("\n" + "=".repeat(60) + "\n");
    console.log(`  ✅ Analysis complete — ${result.summary.total_references} references found`);
  } catch (error) { console.error("\n  ❌ Error:", error instanceof Error ? error.message : error); process.exit(1); }
}
main();
