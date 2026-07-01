# ServiceNow Impact Analysis — Monorepo v2.1

## Architecture

```
servicenow-impact-mcp/
├── shared/          ← Shared library (types, engine, collectors, formatters)
├── backend/         ← Express API server (imports from shared)
├── mcp/             ← MCP stdio server (imports from shared)
├── frontend/        ← React dashboard (unchanged, talks to backend)
└── tests/           ← Unit tests (test shared library)
```

```
Browser (5173) → Express API (3001) → shared/ engine → ServiceNow
Claude Desktop → MCP Server (stdio) → shared/ engine → ServiceNow
```

## Quick Start

```bash
npm run setup        # Install all 4 packages
cp .env.example .env # Configure credentials
npm run dev          # Start API + Dashboard
```

Open **http://localhost:5173**

## Commands

| Command | What It Does |
|---|---|
| `npm run setup` | Install deps for root + shared + backend + mcp + frontend |
| `npm run dev` | Start API + Dashboard (concurrently) |
| `npm run dev:mcp` | Start MCP server (stdio) |
| `npm run build` | Build shared → backend → mcp |
| `npm test` | Run unit tests |
| `npm run test:analyze` | CLI analysis via backend |
| `npm run start:api` | Start compiled API server |
| `npm run start:mcp` | Start compiled MCP server |

## Building Independently

```bash
cd shared && npm run build    # Build shared library first
cd backend && npm run build   # Build Express API
cd mcp && npm run build       # Build MCP server
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "servicenow-impact": {
      "command": "node",
      "args": ["/path/to/servicenow-impact-mcp/mcp/dist/index.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://dev12345.service-now.com",
        "SERVICENOW_USERNAME": "admin",
        "SERVICENOW_PASSWORD": "your-password"
      }
    }
  }
}
```

## License
MIT
