# Snappy

## 📖 概要
Snappyは Next.js 16 と Tailwind CSS 4 で作られたモダンなWebアプリです。Radix UI と shadcn/ui を使ったUIコンポーネントを備え、Upstash Redis を使って簡易的なユーザーデータを保存しています。

## 🛠 主な技術
- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS 4
- Radix UI + shadcn/ui / Lucide React
- next-themes (ライト/ダーク切替)
- Upstash Redis (@upstash/redis) によるシンプルなデータ永続化
- Vercel Analytics

## 🚀 セットアップ
### 前提
- Node.js 18 以上
- パッケージマネージャー: pnpm 推奨（npm / yarn でも可）

### 手順
1. リポジトリ取得
   ```bash
   git clone https://github.com/snappy-dev-team/snappy.git
   cd snappy
   ```
2. 依存インストール
   ```bash
   pnpm install
   ```
3. `.env.local` をプロジェクト直下に作成し、Upstashの環境変数を設定（下記参照）
4. 開発サーバー起動
   ```bash
   pnpm dev
   ```
   ブラウザで http://localhost:3000 を開くと動作を確認できます。

## 🔑 環境変数 (.env.local)
Upstash Redis の REST API を使うために以下を設定します（値はUpstashのダッシュボードで確認できます）。
```
UPSTASH_REDIS_REST_URL="https://<your-db>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<your-rest-token>"
```
- ファイル名は `.env.local`、プロジェクト直下に配置します。
- 変更後は開発サーバーを再起動してください。
- 秘密情報なのでGitへコミットしないのが基本です。

### Upstash Redis を用意する手順
1. Upstashにサインアップし、「Redis」データベースを作成。
2. DBの詳細画面で `REST URL` と `REST TOKEN` をコピー。
3. 上記2つを `.env.local` に貼り付け、保存してから `pnpm dev` を再起動。

## 🗄 データベースの使い方
- APIは `app/api/users/route.ts` を通じて Upstash Redis に保存されています。
- 使用キー: `users`。配列としてユーザーを保存し、要素は `{ id, createdAt, name, email, age?, profile?, role?, image? }` の形です。
- 動作例:
  ```bash
  # 既存ユーザー一覧を取得
  curl http://localhost:3000/api/users

  # ユーザーを追加
  curl -X POST http://localhost:3000/api/users \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com","role":"client"}'
  ```
- Upstashの「Data Browser」から `users` キーの中身を直接確認・編集することもできます。

## 📁 ディレクトリ構成
```
snappy/
├─ app/
│  ├─ api/users/route.ts   # ユーザーAPI（Upstash Redisを利用）
│  ├─ help/ login/ mypage/ register/ search/  # 各ページ
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx             # トップページ
├─ components/             # 共通コンポーネント
│  └─ ui/                  # shadcn/ui コンポーネント
├─ hooks/                  # カスタムフック
├─ lib/                    # ユーティリティ
├─ public/                 # 静的ファイル
├─ package.json
└─ tsconfig.json ほか設定類
```

## 📝 主要コマンド
| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバーを起動（ホットリロードあり） |
| `pnpm build` | 本番ビルドを作成 |
| `pnpm start` | 本番ビルドを起動 |
| `pnpm lint` | ESLint を実行 |

## 💡 開発のヒント
- 新しいページ: `app/your-page/page.tsx` を追加するだけでルーティングされます。
- 新しいコンポーネント: `components/` にファイルを作成し、必要に応じて `components/ui/` のパーツを組み合わせてください。
- スタイリング: Tailwind CSS のユーティリティクラスを中心に、必要に応じて shadcn/ui のプリミティブを上書きして使えます。
