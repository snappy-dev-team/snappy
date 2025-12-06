"use client"

import Header from '@/components/header'

const sections = [
  {
    title: '本サービスの目的',
    body: '美容モデルとクライアント（サロン・個人・学生）が安全かつ円滑にマッチングできる場を提供します。',
  },
  {
    title: '会員資格',
    body: 'モデル会員、クライアント会員、学生プラン利用者は、登録情報が真実かつ最新であることを保証します。運営は不適切と判断した場合、登録拒否・停止・取消を行うことがあります。',
  },
  {
    title: '登録情報の真実性・責任',
    body: '登録者は正確な情報を提供し、変更があれば速やかに更新する義務があります。虚偽情報による損害は当該登録者が負担します。',
  },
  {
    title: '学生プランの審査・停止・取消',
    body: '学生プランは運営による学生証審査を経て承認されます。虚偽申請や規約違反が判明した場合、承認取り消し・利用停止を行います。',
  },
  {
    title: '利用料金・報酬支払い',
    body: '報酬区分（有料/無料）は案件ごとにクライアントが設定します。支払い方法・タイミングは案件詳細に従います。本サービスは必要に応じて手数料を設定し通知します。',
  },
  {
    title: '禁止事項',
    body: '誹謗中傷、違法行為、公序良俗違反、直接取引の持ちかけ、虚偽情報の掲載、第三者へのなりすまし等を禁止します。',
  },
  {
    title: '免責事項',
    body: 'マッチングや報酬支払いに関するトラブルは当事者間で解決するものとし、運営は故意または重過失がある場合を除き責任を負いません。',
  },
  {
    title: '個人情報の取扱い',
    body: '個人情報はプライバシーポリシーに従い適切に取り扱います。必要に応じてアップデートを行い通知します。',
  },
  {
    title: '規約の変更・通知方法',
    body: '本規約は必要に応じて改定します。変更時は本ページへの掲載またはサービス内通知で周知します。',
  },
  {
    title: '準拠法・管轄裁判所',
    body: '本規約は日本法に準拠し、紛争は東京地方裁判所を第一審の専属的合意管轄とします。',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">利用規約</h1>
          <p className="text-muted-foreground mt-2">本サービスを利用する前に必ずお読みください。</p>
        </div>

        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.title} className="rounded-xl border border-border bg-white shadow-sm p-5 space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
