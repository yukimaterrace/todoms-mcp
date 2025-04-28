import { z } from 'zod';

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export interface SignupResponse {
  id: string;
  email: string;
}

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string()
});

export interface UserResponse {
  id: string;
  email: string;
}

// TODO関連モデル
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export const CreateTodoRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional()
});

export const CreateTodosRequestSchema = z.object({
  todos: z.array(CreateTodoRequestSchema)
});

export const UpdateTodoRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  isCompleted: z.boolean()
});

// エラーレスポンスモデル
export interface ErrorResponse {
  code: string;
  message: string;
}

// APIレスポンスラッパー
export interface ApiResponse<T> {
  data: T | null;
  statusCode: number;
  error?: ErrorResponse;
}
