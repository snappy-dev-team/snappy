# 変更点サマリと作業リスト（Snappy拡張）

## 今回の主な変更
- 会員登録: モデル/クライアントとも入力→確認→規約同意→登録に刷新（`/register`）。学生証アップロード対応。
- マイページ: 編集操作を別画面に分離。統計表示＋編集/募集作成ボタンのみ（`/mypage`）。
- プロフィール編集: `/mypage/profile/edit` でモデル/クライアントの詳細入力・公開設定を編集。
- 仕事募集追加: `/mypage/jobs/new?type=general|student` に分離。学生フォームはステータス `approved` のみ有効。項目ラベルを日本語化。
- 検索/公開プロフィール: `/search?tab=models` はモデル画像のみ表示。クリックで `/profile/[id]` に遷移し、公開設定がpublicの項目のみ表示。
- データスキーマ/API: `users` に詳細プロフィール/学生ステータスを保持。`jobs/matches/reviews/metrics/admin` 系エンドポイントを追加。
- サンプルデータ: モデル/一般クライアント/学生クライアント＋募集2件＋マッチ/レビューが入るシード (`/api/admin/seed` or `/admin` ボタン)。

## あなたが実施すること
1) 環境変数確認（ローカル/Vercel）
   - 必須: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - 任意: `BASIC_AUTH_ENABLED`, `BASIC_AUTH_PASS`

2) サンプルデータ投入
   - ブラウザで `/api/admin/seed` or `/admin` → 「サンプルデータ投入」
   - サンプルログイン: `model1@example.com` / `snappy123`, `client1@example.com` / `snappy123`, `student-client@example.com` / `snappy123`

3) 学生プラン審査フロー確認
   - クライアント登録で学生希望 → `student_account_status=pending`
   - `/admin` で `approved` に更新すると学生用募集フォームが有効化

4) 動作確認の推奨
   - `/register` でモデル/クライアント登録 → Upstash `users` に反映
   - `/login` → `/mypage` で統計とボタン表示を確認
   - `/mypage/profile/edit` でプロフィール保存 → `/profile/<id>` に反映（公開のみ表示）
   - `/mypage/jobs/new?type=general|student` で募集登録 → Upstash `jobs` に反映
   - `/search?tab=models` で画像一覧/プロフィール遷移を確認

5) デプロイ時
   - `npm run build` が通ることをローカルで確認
   - Vercel に push 後、上記フローを本番URLで再確認

## 参考: 追加API
- `POST /api/users` / `PATCH /api/users`（登録・プロフィール更新）
- `POST /api/auth/login`（ログイン）
- `GET/POST /api/jobs`（一般/学生 募集）
- `GET/POST /api/matches`（マッチ履歴）
- `GET/POST /api/reviews`（レビュー）
- `GET /api/metrics?userId=...`（マッチ数/レビュー数/平均評価集計）
- `POST /api/admin/student-status`（学生ステータス更新）
- `GET /api/admin/seed`（サンプル投入・重複はスキップ）
