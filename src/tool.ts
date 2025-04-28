import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TodomsRepository } from "./lib/todoms-repository";
import { z } from "zod";
import { 
  ApiResponse, 
  CreateTodosRequestSchema,
  LoginRequestSchema,
  SignupRequestSchema,
  UpdateTodoRequestSchema
} from "./lib/model";

export function createTools(server: McpServer, repository: TodomsRepository) {
  // サインアップツール
  server.tool("signup",
    "Create a new user account",
    SignupRequestSchema.shape,
    async (request) => {
      const response = await repository.signup(request);
      
      return createResponse(response, (data) => ({
        type: "text",
        text: `Successfully registered user: ${data.email} (ID: ${data.id})`
      }));
    }
  );

  // ログインツール
  server.tool("login",
    "Login to the todoms system",
    LoginRequestSchema.shape,
    async (request) => {
      const response = await repository.login(request);
      
      return createResponse(response, (data) => ({
        type: "text",
        text: `Successfully logged in. Access token received.`
      }));
    }
  );

  // ログアウトツール
  server.tool("logout",
    "Logout from the todoms system",
    {},
    async () => {
      repository.logout();
      
      return {
        content: [{ 
          type: "text", 
          text: "Successfully logged out." 
        }]
      };
    }
  );

  // 全TODO取得ツール
  server.tool("get_all_todos",
    "Get all todo items",
    {},
    async () => {
      const response = await repository.getAllTodos();
      
      
      return createResponse(response, (data) => ({
          type: "text",
          text: `${JSON.stringify(data.todos)}`
        })
      );
    }
  );

  // 特定のTODO取得ツール
  server.tool("get_todo",
    "Get a specific todo item by ID",
    { todoId: z.string() },
    async (request) => {
      const response = await repository.getTodo(request.todoId);
      
      return createResponse(response, (data) => ({
        type: "text",
        text: `${JSON.stringify(data)}`
      }));
    }
  );

  // TODO作成ツール
  server.tool("create_todos",
    "Create todo items",
    CreateTodosRequestSchema.shape,
    async (request) => {
      const response = await repository.createTodos(request);
      
      return createResponse(response, (data) =>
        data.todos.map(todo => ({
            type: "text",
            text: `Created todo: ${todo.title} (ID: ${todo.id})`
        }))
      )
    }
  );

  // TODO更新ツール
  server.tool("update_todo",
    "Update a specific todo item",
    {
      todoId: z.string(),
      todoData: UpdateTodoRequestSchema
    },
    async (request) => {
      const { todoId, todoData } = request;
      const response = await repository.updateTodo(todoId, todoData);
      
      return createResponse(response, (data) => ({
        type: "text",
        text: `Updated todo: ${data.title} (ID: ${data.id})`
      }));
    }
  );

  // TODO削除ツール
  server.tool("delete_todo",
    "Delete a specific todo item",
    { todoId: z.string() },
    async (request) => {
      const response = await repository.deleteTodo(request.todoId);
      
      return createResponse(response, () => ({
        type: "text",
        text: `Todo with ID ${request.todoId} has been deleted.`
      }));
    }
  );
}

function createResponse<T>(response: ApiResponse<T>, creator: (data: T) => any) {
  if (response.error) {
    return { content: [{ type: "text", text: `Error: ${response.error.message}` }] }
  }
  return { content: [creator(response.data as T)] }
}
