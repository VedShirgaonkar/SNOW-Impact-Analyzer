import type { LogLevel, LogEntry } from "../types/index.js";
const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
let currentLevel: LogLevel = "info";
export function setLogLevel(level: LogLevel): void { currentLevel = level; }
export function getLogLevel(): LogLevel { return currentLevel; }
function shouldLog(level: LogLevel): boolean { return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]; }
function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;
  const entry: LogEntry = { level, message, timestamp: new Date().toISOString(), ...(context ? { context } : {}) };
  process.stderr.write(JSON.stringify(entry) + "\n");
}
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
};
