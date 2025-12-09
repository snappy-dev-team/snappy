import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-white to-neutral-soft border-t border-border">
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-primary text-xl font-bold mb-4">Snappy</h3>
            <p className="text-sm text-muted-foreground">
              カットモデルと美容師をつなぐ
              <br />
              マッチングサービス
            </p>
          </div>

          {/* サービス */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/models" className="text-muted-foreground hover:text-primary transition-colors">
                  モデルを探す
                </Link>
              </li>
              <li>
                <Link href="/shops" className="text-muted-foreground hover:text-primary transition-colors">
                  サロンを探す
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="text-muted-foreground hover:text-primary transition-colors">
                  使い方
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  ヘルプ / FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* 登録 */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">登録</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register?type=model" className="text-muted-foreground hover:text-primary transition-colors">
                  モデル登録
                </Link>
              </li>
              <li>
                <Link href="/register?type=client" className="text-muted-foreground hover:text-primary transition-colors">
                  クライアント登録
                </Link>
              </li>
            </ul>
          </div>

          {/* ご利用案内 */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">ご利用案内</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSddRKz5uxefdsD7cWUGDN_AH7VIitiePk4g6Dvznzv71hAJHA/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Snappy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
