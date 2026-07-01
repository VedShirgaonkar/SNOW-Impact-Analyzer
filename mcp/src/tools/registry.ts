import type { McpTool } from "@servicenow-impact/shared";
import { logger } from "@servicenow-impact/shared";
import { analyzeFieldImpactTool } from "./analyze-field-impact.js";

const tools: McpTool[] = [analyzeFieldImpactTool];

export function getRegisteredTools(): McpTool[] { return tools; }
export function findTool(name: string): McpTool | undefined { return tools.find((t) => t.definition.name === name); }
export function logRegisteredTools(): void { logger.info(`Registered ${tools.length} MCP tool(s)`, { tools: tools.map((t) => t.definition.name) }); }
