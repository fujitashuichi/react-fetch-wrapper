```sh
src/
  ├── core/             # 通信の基底ロジック（fetchラップ等）
  │     ├── apiClient.ts     # メインのエントリポイント
  │     └── request.ts    # リクエスト実行部
  ├── errors/           # エラー定義
  │     ├── base.ts       # ApiError 基底クラス
  │     ├── protocol.ts   # ProtocolError (4xx, 5xx)
  │     └── schema.ts     # SchemaError (Validation失敗)
  ├── types/            # 型定義
  │     ├── contract.ts   # スキーマと型の対応定義
  │     └── http.ts       # メソッドやステータスコードの型
  └── utils/            # 共通ユーティリティ
```
