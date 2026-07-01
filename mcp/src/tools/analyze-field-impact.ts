import { z } from "zod";
import {
  parseField, ImpactAnalyzer, ServiceNowClient, getServiceNowConfig,
  formatAsJson, formatAsMarkdown, formatErrorMessage, AppError, logger,
} from "@servicenow-impact/shared";
import type { McpTool, McpToolResponse } from "@servicenow-impact/shared";

const inputSchema = {
  type: "object" as const,
  properties: {
    field: { type: "string" as const, description: 'Dot-notation field reference, e.g. "incident.assignment_group"' },
    format: { type: "string" as const, enum: ["json", "markdown"], description: 'Output format: "json" (default) or "markdown"', default: "json" },
  },
  required: ["field"],
  additionalProperties: false,
};

const zodSchema = z.object({
  field: z.string().min(1, "Field reference is required"),
  format: z.enum(["json", "markdown"]).default("json"),
});

export const analyzeFieldImpactTool: McpTool = {
  definition: {
    name: "analyze_field_impact",
    description: "Analyzes the impact of a ServiceNow field across metadata artifacts. Given a dot-notation field reference, queries the ServiceNow instance for Business Rules, Client Scripts, UI Policies, and Script Includes that reference the field. Each reference is classified as TRIGGER, READ, WRITE, or REFERENCE.",
    inputSchema,
  },
  handler: async (args: Record<string, unknown>): Promise<McpToolResponse> => {
    try {
      const parsed = zodSchema.parse(args);
      const field = parseField(parsed.field);
      logger.info("analyze_field_impact invoked", { field: field.raw, format: parsed.format });
      const config = getServiceNowConfig();
      const client = new ServiceNowClient(config);
      const analyzer = new ImpactAnalyzer(client);
      const result = await analyzer.analyze(field);
      const output = parsed.format === "markdown" ? formatAsMarkdown(result) : formatAsJson(result);
      return { content: [{ type: "text", text: output }] };
    } catch (error) {
      logger.error("analyze_field_impact failed", { error: error instanceof Error ? error.message : String(error) });
      const message = formatErrorMessage(error);
      const isValidation = error instanceof AppError && error.code === "VALIDATION_ERROR";
      return { content: [{ type: "text", text: isValidation ? `Validation Error: ${message}` : `Error: ${message}` }], isError: true };
    }
  },
};
