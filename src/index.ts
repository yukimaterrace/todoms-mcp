import { McpServer, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createTools } from "./tool";
import { TodomsRepository } from "./lib/todoms-repository";

// Create an MCP server
const server = new McpServer({
  name: "todoms",
  version: "1.0.0"
});

createTools(server, new TodomsRepository());

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
(async () => {
  await server.connect(transport);
})();
