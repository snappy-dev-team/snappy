# Snappy ログイン機能 README

## 機能概要
- メールアドレス + パスワードでのログインを提供し、ユーザー種別（モデル/クライアント）を選択可能。
- 登録時にパスワードを受け取り、サーバー側で SHA-256 でハッシュ化して保存。
- ログイン時は `/api/auth/login` で認証し、成功時にユーザーデータを返却。
- フロント側ではブラウザ `localStorage` にセッションユーザーを保存して簡易ログイン状態を維持。

## 関連ファイル
- API: `app/api/users/route.ts`（登録）、`app/api/auth/login/route.ts`（ログイン）
- クライアントロジック: `lib/users.ts`（`createUser`/`loginUser`）、`lib/auth.ts`（セッション保存）
- 画面: `app/register/page.tsx`（登録フォーム）、`app/login/page.tsx`（ログインフォーム）

## 使い方（フロント）
1) 新規登録
   - ページ: `/register`
   - 入力: メール、パスワード（8文字以上）、氏名/サロン情報、役割（URL パラメータ `?type=model|client` で切替）。
   - 成功時: `/mypage` へ遷移し、ユーザー情報を `localStorage` に保存。

2) ログイン
   - ページ: `/login`
   - 入力: メール、パスワード、役割（モデル/クライアント）。
   - 成功時: `localStorage` に保存し、`redirect` クエリがあればそこへ、なければ `/mypage` へ遷移。

## API 仕様（要約）
- 登録: `POST /api/users`
  - body: `{ name, email, password, role?, age?, profile?, image? }`
  - 動作: パスワードを SHA-256 でハッシュ化し、Upstash Redis の `users` キーに追加。
  - レスポンス: `{ ok: true, user }`（パスワードハッシュ除外）。

- ログイン: `POST /api/auth/login`
  - body: `{ email, password, role? }`
  - 動作: 入力パスワードをハッシュ化して一致確認。
  - レスポンス: `{ ok: true, user }`（ハッシュ除外）。

## Upstash 連携
- ストレージに Upstash Redis を使用。`Redis.fromEnv()` が環境変数から接続設定を取得。
- 必須環境変数（例）:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- 初回デプロイ時に Redis 上の `users` キーが未存在でも自動で配列として初期化されます。

## Vercel デプロイ時の設定
1) 環境変数を Vercel プロジェクトに登録
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - 必要に応じて `BASIC_AUTH_ENABLED`, `BASIC_AUTH_PASS` など既存の値も設定。

2) デプロイ
   - `npm run build` が通ることを確認してから Vercel にプッシュ。
   - API ルートはサーバーレスで動作し、Upstash へ HTTP 経由で接続。

3) 動作確認
   - `/register` でユーザー作成 → Redis に `users` が増えているか確認（Upstash ダッシュボード）。
   - `/login` で同じメール/役割/パスワードで認証できることを確認。

## 注意点と運用メモ
- 既存のパスワード未登録ユーザーはログインできないため、再登録が必要。
- 現状は簡易ハッシュ（SHA-256）。高セキュリティが必要な場合は PBKDF2 / bcrypt / argon2 などへの切り替えを検討。
- `localStorage` ベースの簡易セッションであり、トークン認可や失効は未実装。運用要件に応じて JWT などの仕組みを追加してください。
- フロントバリデーション: パスワードは 8 文字以上。追加ポリシー（記号必須等）が必要なら `app/register/page.tsx` を拡張してください。
