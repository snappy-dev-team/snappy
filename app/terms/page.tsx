"use client"

import Header from '@/components/header'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Snappy 利用規約</h1>
          <div className="text-sm text-muted-foreground mt-4 text-right">
            <p>制定日：2025年12月9日</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Snappyの運営者（以下「当社」といいます）は、当社が提供する美容師・サロンスタッフとモデル等の利用者（以下総称して「ユーザー」といいます）を対象としたマッチングアプリ／ウェブサイト「Snappy」およびこれに付随する各種サービス（以下総称して「本サービス」といいます）を利用するにあたり遵守いただく条件として、本利用規約（以下「本規約」といいます）を定めます。ユーザーは、本サービスを利用する前に、本規約を必ずお読みください。
          </p>

          {/* 第1条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１条（本サービスの目的）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              美容モデルとクライアント（サロン・個人・学生）が安全かつ円滑にマッチングできる場を提供します。本サービスは、美容師等ユーザーとモデル等ユーザーとの出会い・マッチングの場を提供するものであり、当社は、ユーザー間の施術契約その他の取引の当事者とはなりません。
            </p>
          </section>

          {/* 第2条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第２条（会員資格）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              モデル会員、クライアント会員、学生プラン利用者は、登録情報が真実かつ最新であることを保証します。運営は不適切と判断した場合、登録拒否・停止・取消を行うことがあります。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              未成年のユーザーは、本サービスの利用および本規約への同意について、あらかじめ親権者その他の法定代理人の同意を得たうえで本サービスを利用するものとします。
            </p>
          </section>

          {/* 第3条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第３条（登録情報の真実性・責任）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              登録者は正確な情報を提供し、変更があれば速やかに更新する義務があります。虚偽情報による損害は当該登録者が負担します。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              パスワード等の管理不備、使用上の過誤、第三者の使用等により生じた損害については、ユーザー自身が責任を負うものとし、当社は一切の責任を負いません。
            </p>
          </section>

          {/* 第4条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第４条（学生プランの審査・停止・取消）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              学生プランは運営による学生証審査を経て承認されます。虚偽申請や規約違反が判明した場合、承認取り消し・利用停止を行います。
            </p>
          </section>

          {/* 第5条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第５条（利用料金・報酬支払い）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              報酬区分（有料/無料）は案件ごとにクライアントが設定します。支払い方法・タイミングは案件詳細に従います。本サービスは必要に応じて手数料を設定し通知します。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              有料プランの途中解約がなされた場合であっても、既に支払われた料金は返金されないものとします。ただし、当社が別途定める場合を除きます。
            </p>
          </section>

          {/* 第6条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第６条（禁止事項）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li>誹謗中傷、違法行為、公序良俗違反</li>
              <li>直接取引の持ちかけ</li>
              <li>虚偽情報の掲載</li>
              <li>第三者へのなりすまし</li>
              <li>性的な出会い・異性交際等を主目的とした利用</li>
              <li>ストーカー行為、つきまとい、嫌がらせ</li>
              <li>ネットワークビジネス、マルチ商法、宗教団体、政治団体等への勧誘</li>
              <li>サーバーに過度な負荷をかける行為、不正アクセス</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              当社は、ユーザーが本条に違反したと判断した場合、事前の通知なく、当該ユーザーの投稿コンテンツの削除、本サービスの利用停止、登録抹消その他当社が必要と判断する措置をとることができるものとします。
            </p>
          </section>

          {/* 第7条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第７条（免責事項）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              マッチングや報酬支払いに関するトラブルは当事者間で解決するものとし、運営は故意または重過失がある場合を除き責任を負いません。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              施術に起因して発生した事故、怪我、アレルギー反応、仕上がりへの不満その他一切のトラブルについては、ユーザー間で解決するものとします。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当社がユーザーに対して損害賠償責任を負う場合において、当社に故意又は重過失がある場合を除き、当社の責任は、当該ユーザーが過去３か月間に当社に支払った本サービスの利用料金の総額を上限とします。
            </p>
          </section>

          {/* 第8条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第８条（個人情報の取扱い）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              個人情報はプライバシーポリシーに従い適切に取り扱います。必要に応じてアップデートを行い通知します。当社は、ユーザーによる本サービスの利用状況に関する情報を、統計情報その他個人を特定できない形式に加工したうえで、サービスの改善、マーケティング等の目的で利用することができるものとします。
            </p>
          </section>

          {/* 第9条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第９条（投稿コンテンツ・知的財産権）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              ユーザーは、投稿コンテンツについて、自らが適法な権利を有し、第三者の権利を侵害していないことを表明し、保証するものとします。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              ユーザーは、当社に対し、投稿コンテンツを、本サービスの運営および本サービスの広告・宣伝のために、国内外において無償かつ非独占的に利用する権利を許諾するものとします。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本サービスに関するプログラム、デザイン、ロゴ、商標、テキスト、画像、動画その他一切のコンテンツに関する著作権、商標権その他の知的財産権は、当社または当社にライセンスを許諾した第三者に帰属します。
            </p>
          </section>

          {/* 第10条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１０条（規約の変更・通知方法）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              本規約は必要に応じて改定します。変更時は本ページへの掲載またはサービス内通知で周知します。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ユーザーが、変更後の本規約の効力発生日以降に本サービスを利用した場合、ユーザーは変更後の本規約に同意したものとみなします。
            </p>
          </section>

          {/* 第11条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１１条（準拠法・管轄裁判所）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本規約は日本法に準拠し、紛争は東京地方裁判所を第一審の専属的合意管轄とします。
            </p>
          </section>

          {/* 第12条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１２条（反社会的勢力の排除）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ユーザーは、自らが現在、暴力団、暴力団員、暴力団準構成員、暴力団関係企業、総会屋、社会運動等標ぼうゴロ、特殊知能暴力集団その他これに準ずる者（以下総称して「反社会的勢力」といいます）に該当せず、将来にわたっても該当しないことを表明し、保証します。当社は、ユーザーが反社会的勢力に該当すると判断した場合、何らの通知を要することなく、本サービスの利用停止、登録抹消その他必要な措置をとることができるものとします。
            </p>
          </section>

          <p className="text-sm text-muted-foreground text-right mt-8">以上</p>
        </div>
      </main>
    </div>
  )
}
