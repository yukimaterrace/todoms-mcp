import {
  ApiResponse,
  ErrorResponse,
  SignupResponse,
  Todo,
  TodosResponse,
  TokenResponse,
  UserResponse,
  CreateTodoRequestSchema,
  UpdateTodoRequestSchema,
  RefreshTokenRequestSchema,
  SignupRequestSchema,
  LoginRequestSchema,
} from './model';
import { z } from 'zod';

const API_BASE_URL = 'http://localhost:8080';

/**
 * todoms APIクライアント
 * API_SPEC.mdに準拠したAPIのクライアント実装
 */
export class TodomsApiClient {
  
  /**
   * APIリクエストを実行する共通メソッド
   */
  private async request<T>(
    endpoint: string, 
    method: string, 
    accessToken?: string, 
    body?: any
  ): Promise<ApiResponse<T>> {
    console.log(`${API_BASE_URL}`)
    console.log(`${method} ${API_BASE_URL}${endpoint}`)

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const statusCode = response.status;
      
      // 204 No Contentの場合、レスポンスボディはない
      if (statusCode === 204) {
        return {
          data: null,
          statusCode,
        };
      }
      
      const responseData = await response.json().catch(() => null);
      
      // エラーレスポンスの場合
      if (!response.ok) {
        const errorResponse: ErrorResponse = responseData as ErrorResponse;
        return {
          data: null,
          statusCode,
          error: errorResponse,
        };
      }

      // 正常なレスポンスの場合
      return {
        data: responseData as T,
        statusCode,
      };
    } catch (error) {
      // ネットワークエラーなどの例外
      return {
        data: null,
        statusCode: 0,
        error: {
          code: 'client-error',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      };
    }
  }

  /**
   * ユーザー登録
   * @param {SignupRequest} data - 登録情報
   * @returns {Promise<ApiResponse<SignupResponse>>} - 登録結果
   */
  async signup(data: z.infer<typeof SignupRequestSchema>): Promise<ApiResponse<SignupResponse>> {
    return this.request<SignupResponse>('/api/auth/signup', 'POST', undefined, data);
  }

  /**
   * ログイン
   * @param {LoginRequest} data - ログイン情報
   * @returns {Promise<ApiResponse<TokenResponse>>} - トークン情報
   */
  async login(data: z.infer<typeof LoginRequestSchema>): Promise<ApiResponse<TokenResponse>> {
    return this.request<TokenResponse>('/api/auth/login', 'POST', undefined, data);
  }

  /**
   * トークン更新
   * @param {RefreshTokenRequest} data - リフレッシュトークン
   * @returns {Promise<ApiResponse<TokenResponse>>} - 新しいトークン情報
   */
  async refreshToken(data: z.infer<typeof RefreshTokenRequestSchema>): Promise<ApiResponse<TokenResponse>> {
    return this.request<TokenResponse>('/api/auth/refresh', 'POST', undefined, data);
  }

  /**
   * 現在のユーザー情報取得
   * @param {string} accessToken - アクセストークン
   * @returns {Promise<ApiResponse<UserResponse>>} - ユーザー情報
   */
  async getCurrentUser(accessToken: string): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/api/auth/me', 'GET', accessToken);
  }

  /**
   * 全TODOアイテム取得
   * @param {string} accessToken - アクセストークン
   * @returns {Promise<ApiResponse<TodosResponse>>} - TODOアイテムリスト
   */
  async getAllTodos(accessToken: string): Promise<ApiResponse<TodosResponse>> {
    return this.request<TodosResponse>('/api/todos', 'GET', accessToken);
  }

  /**
   * 特定のTODOアイテム取得
   * @param {string} accessToken - アクセストークン
   * @param {string} todoId - TODOアイテムID
   * @returns {Promise<ApiResponse<Todo>>} - TODOアイテム
   */
  async getTodo(accessToken: string, todoId: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/api/todos/${todoId}`, 'GET', accessToken);
  }

  /**
   * 新規TODOアイテム作成
   * @param {string} accessToken - アクセストークン
   * @param {CreateTodoRequest} data - TODOアイテム作成情報
   * @returns {Promise<ApiResponse<Todo>>} - 作成されたTODOアイテム
   */
  async createTodo(accessToken: string, data: z.infer<typeof CreateTodoRequestSchema>): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/api/todos', 'POST', accessToken, data);
  }

  /**
   * TODOアイテム更新
   * @param {string} accessToken - アクセストークン
   * @param {string} todoId - TODOアイテムID
   * @param {UpdateTodoRequest} data - TODOアイテム更新情報
   * @returns {Promise<ApiResponse<Todo>>} - 更新されたTODOアイテム
   */
  async updateTodo(
    accessToken: string, 
    todoId: string, 
    data: z.infer<typeof UpdateTodoRequestSchema>
  ): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/api/todos/${todoId}`, 'PUT', accessToken, data);
  }

  /**
   * TODOアイテム削除
   * @param {string} accessToken - アクセストークン
   * @param {string} todoId - TODOアイテムID
   * @returns {Promise<ApiResponse<null>>} - 削除結果
   */
  async deleteTodo(accessToken: string, todoId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/todos/${todoId}`, 'DELETE', accessToken);
  }
}