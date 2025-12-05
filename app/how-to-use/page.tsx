import Header from '@/components/header'
import Footer from '@/components/footer'

export default function HowToUsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 space-y-12">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">HOW TO USE</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Snappyの使い方</h1>
            <p className="text-muted-foreground text-lg">
              モデルを探したい方も、募集を掲載したい美容師・サロンの方も、以下のステップで簡単に始められます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-neutral-soft/50 p-8 space-y-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">For モデル</p>
              <h2 className="text-2xl font-bold text-foreground">モデルとして応募する</h2>
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
                <li>無料アカウント登録後、希望のエリア・スタイル・日時を設定してプロフィールを作成。</li>
                <li>検索結果から気になる募集を保存し、詳細を確認して応募。</li>
                <li>チャットで日程やスタイルを擦り合わせ、決定したら当日サロンへ。</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-white shadow-sm p-8 space-y-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">For サロン/美容師</p>
              <h2 className="text-2xl font-bold text-foreground">募集を掲載する</h2>
              <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
                <li>無料会員登録後、メニュー、募集条件、必要なスキルやスタイル例を入力して募集を投稿。</li>
                <li>応募が来たらプロフィールを確認し、チャットで施術内容や持ち物を案内。</li>
                <li>来店後に施術を実施。終了後はレビューや写真を追加して次の募集に活かせます。</li>
              </ol>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-neutral-soft/60 p-8 md:p-10 space-y-4">
            <h3 className="text-xl font-semibold text-foreground">よく使う機能</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground text-sm">
              <li className="bg-white rounded-xl border border-border px-4 py-3">・キーワード / エリア / 日時での絞り込み検索</li>
              <li className="bg-white rounded-xl border border-border px-4 py-3">・気になる募集の保存と後で再チェック</li>
              <li className="bg-white rounded-xl border border-border px-4 py-3">・チャットでの事前相談と写真共有</li>
              <li className="bg-white rounded-xl border border-border px-4 py-3">・プロフィールの公開 / 非公開切り替え</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">最短3分でスタート</p>
              <h3 className="text-2xl font-bold text-foreground">今日からSnappyを試してみませんか？</h3>
              <p className="text-muted-foreground">登録は無料。いつでもプラン変更や退会ができます。</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/register?type=model"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition"
              >
                モデル登録へ
              </a>
              <a
                href="/register?type=client"
                className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-primary font-semibold hover:bg-primary-light transition"
              >
                サロン登録へ
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
