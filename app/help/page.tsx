import Header from '@/components/header'
import Footer from '@/components/footer'

const faqs = [
  {
    question: 'アカウント登録は無料ですか？',
    answer: 'はい、無料で登録できます。プラン変更や退会もいつでも行えます。',
  },
  {
    question: 'モデルとして応募する流れを教えてください。',
    answer:
      '希望条件を設定したプロフィールを作成し、検索から募集を選んで応募します。チャットで日程やスタイルを調整したら当日サロンにお越しください。',
  },
  {
    question: '美容師・サロン側はどのように募集を掲載しますか？',
    answer:
      '無料登録後、メニューや募集条件、希望スタイル例を入力して公開します。応募が届いたらチャットで詳細を伝え、日程を確定してください。',
  },
  {
    question: '費用や報酬のやり取りはどのように行われますか？',
    answer: '案件ごとに報酬設定が異なります。募集に記載された条件を確認のうえ、必要に応じてチャットですり合わせてください。',
  },
  {
    question: 'キャンセルや日程変更は可能ですか？',
    answer:
      '事前にチャットで連絡し、双方合意のうえで日程変更やキャンセルを行ってください。無断キャンセルはお控えください。',
  },
  {
    question: 'プロフィールの公開・非公開は切り替えできますか？',
    answer: 'はい、設定から公開ステータスを切り替えできます。募集や応募の状況に応じて調整してください。',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 md:px-8 py-16 space-y-10">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">HELP / FAQ</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">ヘルプ・よくある質問</h1>
            <p className="text-muted-foreground text-lg">
              Snappyのご利用で迷ったときは、まずこちらをご確認ください。解決しない場合はお問い合わせフォームからご連絡いただけます。
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map(item => (
              <details key={item.question} className="group rounded-2xl border border-border bg-neutral-soft/40 p-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base md:text-lg font-semibold text-foreground">{item.question}</span>
                  <span className="text-primary text-sm group-open:rotate-45 transition-transform">＋</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">まだ解決しない場合</p>
              <h3 className="text-2xl font-bold text-foreground">お問い合わせフォームからご連絡ください</h3>
              <p className="text-muted-foreground">ご利用方法やアカウントに関するご相談を受け付けています。</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/how-to-use"
                className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-primary font-semibold hover:bg-primary-light transition"
              >
                使い方を見る
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSddRKz5uxefdsD7cWUGDN_AH7VIitiePk4g6Dvznzv71hAJHA/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
