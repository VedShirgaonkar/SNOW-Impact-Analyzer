import type { Request, Response } from "express";
import { z } from "zod";
import {
  parseField, ServiceNowClient, ImpactAnalyzer, getServiceNowConfig,
  formatAsMarkdown, AppError, logger,
} from "@servicenow-impact/shared";

const analyzeSchema = z.object({
  field: z.string().min(1, "Field reference is required"),
  format: z.enum(["json", "markdown"]).default("json"),
});

export async function analyzeRoute(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  try {
    const parsed = analyzeSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Validation Error", message: parsed.error.issues.map((i) => i.message).join("; "), code: "VALIDATION_ERROR" }); return; }
    const { field: fieldRaw, format } = parsed.data;
    let field;
    try { field = parseField(fieldRaw); } catch (err) { res.status(400).json({ error: "Invalid Field Format", message: err instanceof Error ? err.message : "Invalid field reference", code: "VALIDATION_ERROR" }); return; }
    logger.info("Analyze request received", { field: field.raw, format });
    const config = getServiceNowConfig();
    const client = new ServiceNowClient(config);
    const analyzer = new ImpactAnalyzer(client);
    const result = await analyzer.analyze(field);
    const markdown = formatAsMarkdown(result);
    const duration = Date.now() - startTime;
    logger.info("Analyze request complete", { field: field.raw, totalReferences: result.summary.total_references, durationMs: duration });
    res.json({ success: true, data: result, markdown, meta: { durationMs: duration, timestamp: new Date().toISOString() } });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Analyze request failed", { error: error instanceof Error ? error.message : String(error), durationMs: duration });
    if (error instanceof AppError) {
      const statusMap: Record<string, number> = { VALIDATION_ERROR: 400, CONFIGURATION_ERROR: 500, SERVICENOW_API_ERROR: 502, COLLECTOR_ERROR: 500 };
      res.status(statusMap[error.code] ?? 500).json({ error: error.name, message: error.message, code: error.code }); return;
    }
    res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred.", code: "INTERNAL_ERROR" });
  }
}

export async function configRoute(_req: Request, res: Response): Promise<void> {
  try {
    const config = getServiceNowConfig();
    let instanceName = config.instanceUrl;
    try { instanceName = new URL(config.instanceUrl).hostname; } catch { /* use raw */ }
    res.json({ instanceUrl: config.instanceUrl, instanceName });
  } catch (error) { res.status(500).json({ error: "Configuration Error", message: "Could not load instance configuration.", code: "CONFIGURATION_ERROR" }); }
}

export async function statusRoute(_req: Request, res: Response): Promise<void> {
  try {
    const config = getServiceNowConfig();
    const client = new ServiceNowClient(config);
    let instanceName = config.instanceUrl;
    try { instanceName = new URL(config.instanceUrl).hostname; } catch { /* use raw */ }
    logger.info("Status check: pinging ServiceNow instance");
    const ping = await client.ping();
    logger.info("Status check complete", { reachable: ping.reachable, authenticated: ping.authenticated, latencyMs: ping.latencyMs });
    res.json({ instanceUrl: config.instanceUrl, instanceName, reachable: ping.reachable, authenticated: ping.authenticated, latencyMs: ping.latencyMs, error: ping.error ?? null, status: ping.authenticated ? "connected" : ping.reachable ? "auth_failed" : "disconnected" });
  } catch (error) {
    logger.error("Status check failed", { error: error instanceof Error ? error.message : String(error) });
    res.json({ instanceUrl: "", instanceName: "Unknown", reachable: false, authenticated: false, latencyMs: 0, error: error instanceof Error ? error.message : "Configuration error", status: "error" });
  }
}
