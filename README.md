# todoms-mcp

todoms-mcp は、Todo管理アプリケーション「todoms」用のModel Context Protocol（MCP）サーバーです。MCPを使用してユーザー認証とTodo管理の機能を提供します。

## 概要

このプロジェクトは、Model Context Protocol（MCP）を活用して、AI開発ツールからTodo管理アプリケーションの機能にアクセスするためのブリッジとして機能します。ユーザー登録、認証、およびTodoアイテムの作成、取得、更新、削除などの機能を提供します。

## 機能

* ユーザー管理
  * サインアップ - 新規ユーザー登録
  * ログイン - 認証トークン取得
  * ログアウト - セッション終了
  * 現在のユーザー情報取得

* Todo管理
  * 全Todoの取得
  * 特定のTodoの取得
  * 単一または複数のTodoの作成
  * Todoの更新
  * Todoの削除

## 技術スタック

* TypeScript - 開発言語
* Node.js - 実行環境
* Model Context Protocol (MCP) SDK - AI開発ツールとの連携
* Zod - データバリデーション
* Fetch API - HTTPリクエスト

## 前提条件

* Node.js (v14以上推奨)
* npm または yarn
* [todoms API サーバー](http://localhost:8080)が稼働していること

## インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/todoms-mcp.git
cd todoms-mcp

# 依存関係のインストール
npm install
# または
yarn install
```

## 使用方法

### ビルド

```bash
npm run build
# または
yarn build
```

### 起動

```bash
npm start
# または
yarn start
```

MCPサーバーが起動し、stdin/stdoutを通じて通信を行います。

## MCP ツール一覧

このMCPサーバーは以下のツールを提供します：

1. **signup** - ユーザー登録
   - パラメータ: `email`, `password`

2. **login** - ログイン
   - パラメータ: `email`, `password`

3. **logout** - ログアウト
   - パラメータ: なし

4. **get_all_todos** - 全Todoを取得
   - パラメータ: なし

5. **get_todo** - 特定のTodoを取得
   - パラメータ: `todoId`

6. **create_todos** - 複数のTodoを作成
   - パラメータ: `todos` (Todoオブジェクトの配列)

7. **update_todo** - Todoを更新
   - パラメータ: `todoId`, `todoData`

8. **delete_todo** - Todoを削除
   - パラメータ: `todoId`

## プロジェクト構造

```
todoms-mcp/
├── src/
│   ├── index.ts            # MCPサーバーのエントリーポイント
│   ├── tool.ts             # MCPツールの定義
│   └── lib/
│       ├── api-client.ts   # TodomsのRESTful APIクライアント
│       ├── model.ts        # データモデルとZodスキーマ
│       └── todoms-repository.ts  # APIクライアントのラッパー
├── package.json
├── tsconfig.json
└── README.md
```

## 開発

### API設定

APIのベースURLは `src/lib/api-client.ts` の `API_BASE_URL` 定数で定義されています。デフォルトは `http://localhost:8080` です。必要に応じて変更してください。

### 新機能の追加

1. `model.ts` にデータモデルとバリデーションスキーマを追加
2. `api-client.ts` にAPIエンドポイントへのメソッドを追加
3. 必要に応じて `todoms-repository.ts` にリポジトリメソッドを追加
4. `tool.ts` に新しいツールを定義

## ライセンス

ISC

## 謝辞

* [Model Context Protocol (MCP)](https://modelcontextprotocol.github.io/)
* [Zod](https://github.com/colinhacks/zod)