import {
  ApiResponse,
  SignupResponse,
  Todo,
  TodosResponse,
  TokenResponse,
  UserResponse,
  CreateTodoRequestSchema,
  UpdateTodoRequestSchema,
  SignupRequestSchema,
  LoginRequestSchema,
  CreateTodosRequestSchema,
} from './model';
import { TodomsApiClient } from './api-client';
import { z } from 'zod';

/**
 * TodomsRepository
 * TodomsApiClientのラッパーで、認証トークンを内部に保持しておくためのリポジトリクラス
 */
export class TodomsRepository {
  private apiClient: TodomsApiClient;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.apiClient = new TodomsApiClient();
  }

  /**
   * ユーザー登録
   * @param {z.infer<typeof SignupRequestSchema>} data - 登録情報
   * @returns {Promise<ApiResponse<SignupResponse>>} - 登録結果
   */
  async signup(data: z.infer<typeof SignupRequestSchema>): Promise<ApiResponse<SignupResponse>> {
    return this.apiClient.signup(data);
  }

  /**
   * ログイン
   * @param {z.infer<typeof LoginRequestSchema>} data - ログイン情報
   * @returns {Promise<ApiResponse<TokenResponse>>} - トークン情報
   */
  async login(data: z.infer<typeof LoginRequestSchema>): Promise<ApiResponse<TokenResponse>> {
    const response = await this.apiClient.login(data);
    
    if (response.data) {
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    }
    
    return response;
  }

  /**
   * トークン更新
   * @returns {Promise<ApiResponse<TokenResponse>>} - 新しいトークン情報
   */
  async refreshTokenIfNeeded(): Promise<ApiResponse<TokenResponse> | null> {
    if (!this.refreshToken) {
      return null;
    }

    const response = await this.apiClient.refreshToken({ refresh_token: this.refreshToken });
    
    if (response.data) {
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    }
    
    return response;
  }

  /**
   * 現在のユーザー情報取得
   * @returns {Promise<ApiResponse<UserResponse>>} - ユーザー情報
   */
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.getCurrentUser(this.accessToken);
  }

  /**
   * 全TODOアイテム取得
   * @returns {Promise<ApiResponse<TodosResponse>>} - TODOアイテムリスト
   */
  async getAllTodos(): Promise<ApiResponse<TodosResponse>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.getAllTodos(this.accessToken);
  }

  /**
   * 特定のTODOアイテム取得
   * @param {string} todoId - TODOアイテムID
   * @returns {Promise<ApiResponse<Todo>>} - TODOアイテム
   */
  async getTodo(todoId: string): Promise<ApiResponse<Todo>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.getTodo(this.accessToken, todoId);
  }

  /**
   * 新規TODOアイテム作成
   * @param {z.infer<typeof CreateTodoRequestSchema>} data - TODOアイテム作成情報
   * @returns {Promise<ApiResponse<Todo>>} - 作成されたTODOアイテム
   */
  async createTodo(data: z.infer<typeof CreateTodoRequestSchema>): Promise<ApiResponse<Todo>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.createTodo(this.accessToken, data);
  }

  /**
   * 複数の新規TODOアイテム作成
   * @param {z.infer<typeof CreateTodosRequestSchema>} data - 複数のTODOアイテム作成情報
   * @returns {Promise<ApiResponse<TodosResponse>>} - 作成されたTODOアイテム一覧
   */
  async createTodos(data: z.infer<typeof CreateTodosRequestSchema>): Promise<ApiResponse<TodosResponse>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }

    // 複数のTODO作成リクエストを実行
    const todoPromises = data.todos.map(todoData => 
      this.apiClient.createTodo(this.accessToken!, todoData)
    );
    
    const results = await Promise.all(todoPromises);
    
    // エラーがある場合は最初のエラーを返す
    const errorResult = results.find(result => result.error);
    if (errorResult) {
      return {
        data: null,
        statusCode: errorResult.statusCode,
        error: errorResult.error
      };
    }
    
    // 全てのTODOを取得してレスポンスを作成
    const todos: Todo[] = results
      .filter(result => result.data !== null)
      .map(result => result.data as Todo);
    
    return {
      data: { todos },
      statusCode: 200
    };
  }

  /**
   * TODOアイテム更新
   * @param {string} todoId - TODOアイテムID
   * @param {z.infer<typeof UpdateTodoRequestSchema>} data - TODOアイテム更新情報
   * @returns {Promise<ApiResponse<Todo>>} - 更新されたTODOアイテム
   */
  async updateTodo(
    todoId: string, 
    data: z.infer<typeof UpdateTodoRequestSchema>
  ): Promise<ApiResponse<Todo>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.updateTodo(this.accessToken, todoId, data);
  }

  /**
   * TODOアイテム削除
   * @param {string} todoId - TODOアイテムID
   * @returns {Promise<ApiResponse<null>>} - 削除結果
   */
  async deleteTodo(todoId: string): Promise<ApiResponse<null>> {
    if (!this.accessToken) {
      return {
        data: null,
        statusCode: 401,
        error: {
          code: 'client-error',
          message: 'No access token available. Please login first.'
        }
      };
    }
    
    return this.apiClient.deleteTodo(this.accessToken, todoId);
  }

  /**
   * ログアウト
   * トークン情報をクリアします
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  /**
   * 認証済みかどうかを確認
   * @returns {boolean} - 認証済みならtrue
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }
}
