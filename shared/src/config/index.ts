import { z } from "zod";
import { ConfigurationError } from "../errors/index.js";
import { setLogLevel } from "../logging/logger.js";
import type { LogLevel, ServiceNowConfig } from "../types/index.js";
const envSchema = z.object({
  SERVICENOW_INSTANCE_URL: z.string().url("SERVICENOW_INSTANCE_URL must be a valid URL"),
  SERVICENOW_USERNAME: z.string().min(1, "SERVICENOW_USERNAME is required"),
  SERVICENOW_PASSWORD: z.string().min(1, "SERVICENOW_PASSWORD is required"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  MCP_SERVER_NAME: z.string().default("servicenow-impact-mcp"),
  MCP_SERVER_VERSION: z.string().default("2.1.0"),
});
export type EnvConfig = z.infer<typeof envSchema>;
let cachedConfig: EnvConfig | null = null;
export function loadConfig(): EnvConfig {
  if (cachedConfig) return cachedConfig;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) { const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n"); throw new ConfigurationError(`Invalid environment configuration:\n${issues}`); }
  cachedConfig = parsed.data; setLogLevel(cachedConfig.LOG_LEVEL as LogLevel); return cachedConfig;
}
export function getServiceNowConfig(): ServiceNowConfig {
  const env = loadConfig();
  return { instanceUrl: env.SERVICENOW_INSTANCE_URL.replace(/\/$/, ""), username: env.SERVICENOW_USERNAME, password: env.SERVICENOW_PASSWORD };
}
export function resetConfig(): void { cachedConfig = null; }
