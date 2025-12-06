# Snappy データストア & 運用手順（Upstash Redis ベース）

## 1. 使っているキー
- `users`: 会員情報（モデル/クライアント・学生ステータス・プロフィールを包含）
- `jobs`: 仕事募集（一般/学生アカウント用）
- `matches`: マッチ履歴（model_user_id / client_user_id / job_id）
- `reviews`: レビュー（target_user_id / author_user_id / rating / comment）

すべて Upstash Redis の JSON 配列として保存しています。

## 2. 必須環境変数（Vercel・ローカル共通）
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `BASIC_AUTH_ENABLED`, `BASIC_AUTH_PASS`（必要なら API/画面にベーシック認証をかけるため）

Vercel では「プロジェクト Settings > Environment Variables」で追加してください。

## 3. API 一覧（フロントと連携済み）
- `POST /api/users`：モデル/クライアントの新規登録（登録→確認画面で使う）
- `PATCH /api/users`：マイページからプロフィール更新
- `POST /api/auth/login`：ログイン
- `GET /api/jobs` / `POST /api/jobs`：仕事募集の一覧・登録（一般/学生共通、account_type で分岐）
- `GET /api/matches` / `POST /api/matches`：マッチ履歴
- `GET /api/reviews` / `POST /api/reviews`：レビュー
- `GET /api/metrics?userId=xxx`：動的指標（マッチ数/レビュー数/平均評価）
- `POST /api/admin/student-status`：学生アカウントの承認/却下更新
- `GET /api/admin/seed`：サンプルデータ投入

## 4. サンプルデータの中身
- モデル1名（メール: `model1@example.com` / パスワード: `snappy123`）
- クライアント一般1名（`client1@example.com` / `snappy123`）
- クライアント学生1名（`student-client@example.com` / `snappy123`、学生ステータス approved 済み）
- 一般募集1件・学生募集1件
- マッチ2件・レビュー2件（平均評価が計算される）

投入方法: `/api/admin/seed` に GET でアクセス（管理画面 `/admin` の「サンプルデータ投入」ボタンでも実行可）。既存データは残し、重複メールはスキップします。

## 5. 学生プラン審査フロー
1. クライアント登録で「学生プランを希望する」にチェック → `student_account_status` が `pending`
2. 管理画面 `/admin` または `POST /api/admin/student-status` で `approved` に更新
3. `approved` のみ、マイページで「学生アカウント用仕事募集フォーム」が有効化

## 6. デプロイ手順（Vercel）
1. env を Vercel に設定（前述の 3 つ以上）
2. `npm run build` がローカルで通ることを確認
3. Vercel に push / Deploy
4. 動作確認
   - `/register` でモデル/クライアント登録 → Upstash の `users` にレコードが増える
   - `/login` → `/mypage` へ遷移
   - クライアントで仕事募集を登録すると `jobs` が増える
   - `/admin` で学生ステータスを切り替えられる
   - `/api/metrics?userId=<id>` でマッチ数/レビュー数/平均評価が動的に返る

## 7. データ構造のポイント
- ユーザー: `role`（model|client）、`email`、`passwordHash` に加え、登録時入力の各フィールドをそのままキーとして保持。`model_profile` / `client_profile` にマイページ編集内容を格納。
- 仕事募集: `account_type`（general|student）で一般/学生を分岐。フォームの各項目はフィールド名でそのまま保存。
- 指標: `metrics` は保存せず、`matches` と `reviews` を都度集計。

## 8. 運用 Tips
- 画像は URL 前提。S3 / Cloud Storage 等にアップロードしたリンクを入力してください（本リポにはアップローダーなし）。
- 既存データを壊さずに拡張する設計なので、旧 `users` に残った簡易データがあっても新フィールドは undefined のまま動きます。
- テスト用に `snappy/.env.local` を複製し、必要なら BASIC 認証を無効化してローカル確認してください。
