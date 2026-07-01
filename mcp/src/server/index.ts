import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig, logger } from "@servicenow-impact/shared";
import { getRegisteredTools, findTool, logRegisteredTools } from "../tools/registry.js";

export async function startServer(): Promise<void> {
  const config = loadConfig();
  const server = new Server(
    { name: config.MCP_SERVER_NAME, version: config.MCP_SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getRegisteredTools().map((t) => ({
      name: t.definition.name,
      description: t.definition.description,
      inputSchema: t.definition.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.info("Tool call received", { tool: name });
    const tool = findTool(name);
    if (!tool) {
      return { content: [{ type: "text" as const, text: `Unknown tool: ${name}. Available: ${getRegisteredTools().map((t) => t.definition.name).join(", ")}` }], isError: true };
    }
    return await tool.handler(args ?? {});
  });

  logRegisteredTools();
  logger.info("Starting MCP server", { name: config.MCP_SERVER_NAME, version: config.MCP_SERVER_VERSION, transport: "stdio" });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("MCP server connected and ready");
}
