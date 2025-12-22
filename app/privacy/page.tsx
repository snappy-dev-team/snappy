"use client"

import Header from '@/components/header'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Snappy プライバシーポリシー</h1>
          <div className="text-sm text-muted-foreground mt-4 text-right">
            <p>制定日：2025年12月9日</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Snappyの運営者（以下「当社」といいます）は、当社が提供する美容師・サロンスタッフとモデル等の利用者（以下総称して「ユーザー」といいます）を対象としたマッチングアプリ／ウェブサイト「Snappy」およびこれに付随する各種サービス（以下総称して「本サービス」といいます）において取り扱う利用者の情報について、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
          </p>

          {/* 第1条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１条（個人情報等）</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>「個人情報」とは、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）に定める「個人情報」をいい、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレス、プロフィール写真その他の記述等により特定の個人を識別できるものをいいます。</li>
              <li>「個人データ」とは、個人情報保護法に定める「個人データ」をいい、当社が検索可能な状態で体系的に構成した個人情報の集合物をいいます。</li>
              <li>「保有個人データ」とは、当社が開示、訂正等の権限を有する個人データをいいます。</li>
              <li>「個人関連情報」とは、Cookieや広告識別子、閲覧履歴など、それ自体では特定の個人を識別できないが、他の情報と容易に照合することにより個人に関する情報となり得るものをいいます。</li>
            </ol>
          </section>

          {/* 第2条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第２条（取得する情報の種類）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              当社は、本サービスの提供にあたり、以下のユーザー情報を取得することがあります。<br />
              取得は、ユーザーご本人による入力、提携サービスからの連携、自動取得のいずれかの方法で行います。
            </p>
            <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">会員登録・ログインに関する情報</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>氏名またはニックネーム</li>
                  <li>性別、生年月日、年齢層</li>
                  <li>アイコン画像・プロフィール画像</li>
                  <li>メールアドレス、パスワード等の認証情報</li>
                  <li>電話番号、連絡用SNSアカウント（例：InstagramアカウントID 等）</li>
                  <li>美容師・サロンスタッフの場合：所属サロン名、サロン住所、役職/ポジション、経験年数、得意な施術内容等</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">モデル・施術内容に関する情報</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>髪の状態や履歴（長さ、カラー履歴、ブリーチ履歴、パーマ・縮毛矯正の有無等）</li>
                  <li>希望する施術内容や条件（例：カットのみ／カラー可否／NG条件 等）</li>
                  <li>来店希望エリア、最寄り駅、移動可能エリア</li>
                  <li>施術前後の写真・動画（ビフォーアフター写真を含む）</li>
                  <li>施術日時、施術内容、担当美容師、利用メニュー等の予約・施術履歴</li>
                  <li>施術に関するアレルギー、体質、既往症等の情報（ユーザーが任意に提供する場合に限ります）</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">コミュニケーション・投稿等に関する情報</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>アプリ内メッセージの内容、送受信日時</li>
                  <li>レビュー・評価・コメントなど、ユーザーが投稿するコンテンツ</li>
                  <li>画像・テキストその他ユーザーが本サービスにアップロードするコンテンツ</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">決済・課金に関する情報</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>有料プランの契約状況、利用期間、請求金額等の課金情報</li>
                  <li>クレジットカード情報その他決済に必要な情報（ただし、クレジットカード番号等の重要情報は決済代行事業者が管理し、当社は当該情報自体を保持しません。）</li>
                  <li>返金対応や請求に関する履歴</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">端末・ログ情報等（自動取得される情報）</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>端末識別子、OSの種類・バージョン、端末の言語設定</li>
                  <li>アプリケーションのバージョン、ブラウザの種類、IPアドレス</li>
                  <li>アクセス日時、操作ログ、本サービス内の閲覧・利用履歴</li>
                  <li>広告識別子（Advertising ID 等）</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">位置情報（ユーザーが許可した場合）</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>位置情報サービスをONにしている場合の概略位置情報</li>
                  <li>サロンや美容師・モデルの検索のために必要な範囲での位置情報</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">お問い合わせ・アンケート等に関する情報</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>お問い合わせフォームやメール等でユーザーが記入・送信した内容</li>
                  <li>当社から依頼するアンケートの回答内容</li>
                  <li>本人確認のために必要な追加情報</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">その他</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>上記のほか、本サービスの提供・保守・改善に必要な範囲で、当社が別途取得することについてあらかじめ通知し、または公表した情報</li>
                </ul>
              </li>
            </ol>
          </section>

          {/* 第3条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第３条（個人情報の利用目的）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              当社は、第２条の方法により取得した情報を、以下の目的のために利用します。
            </p>
            <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">本サービスを提供・運営するため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>マッチング機能（美容師とモデルの相互検索・応募・承諾）の提供</li>
                  <li>予約管理、施術履歴の記録・閲覧、ビフォーアフター画像管理等の機能提供</li>
                  <li>ログイン、ユーザー認証、本人確認を行うため</li>
                </ul>
                <p className="ml-4 mt-2 text-xs">なお、当社がユーザーの投稿したビフォーアフター画像その他の画像等を本サービス外で広告・宣伝目的に利用する場合には、別途ユーザーの同意を得たうえで行います。</p>
              </li>
              <li>
                <span className="font-medium text-foreground">ユーザー間の安全・信頼性を確保するため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>不正利用・なりすまし・迷惑行為の検知・防止</li>
                  <li>利用規約に違反する行為の調査・対応</li>
                  <li>トラブル発生時の事実確認、関係各所への連絡・対応</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">本サービスの改善・新機能開発のため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>利用状況の分析、アンケート結果の分析</li>
                  <li>ユーザー体験の改善、UI/UXの最適化</li>
                  <li>新たな機能・サービスの企画・開発</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">施術の安全性を確保するため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>アレルギー、体質その他の健康状態に関する情報を把握し、施術内容の判断および安全確保に役立てるため</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">お知らせ・ご案内等の配信のため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>本サービスに関する重要なお知らせ（仕様変更・障害・規約変更等）の通知</li>
                  <li>キャンペーン、イベント、アンケート、アップデート情報等の案内</li>
                  <li>ユーザーの属性・利用状況に応じた情報の配信（ただし配信停止の手段を提供します）</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">課金・決済・事務処理のため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>有料プランの利用料金の請求・決済・入金管理</li>
                  <li>請求内容に関するお問い合わせ対応</li>
                  <li>不正決済の検知・防止</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">匿名加工情報・統計情報の作成のため</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>個人を識別できない形式に加工した統計データを作成し、サービス改善やマーケティングに利用するため</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">上記各目的に付随する目的のため</span>
              </li>
            </ol>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              利用目的を変更する場合には、その内容が変更前と関連性を有すると合理的に認められる範囲内で行い、変更内容を当社所定の方法（本アプリ上での表示、ウェブサイトでの公表等）により通知または公表します。
            </p>
          </section>

          {/* 第4条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第４条（法令等の遵守）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当社は、個人情報保護法その他関連法令、ガイドラインおよび本ポリシーを遵守し、適法かつ公正な手段により個人情報を取得・利用・管理します。
            </p>
          </section>

          {/* 第5条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第５条（第三者提供）</h2>
            <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground leading-relaxed">
              <li>
                当社は、次のいずれかに該当する場合を除き、あらかじめユーザー本人の同意を得ることなく、個人データを第三者に提供しません。
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                  <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                  <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令に定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                </ol>
              </li>
              <li>
                前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
                  <li>当社が利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部を委託する場合</li>
                  <li>合併、会社分割、事業譲渡その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                  <li>個人情報保護法の定めに基づき共同利用を行う場合</li>
                </ol>
              </li>
              <li>当社は、法令に基づき第三者提供に関する記録の作成・保存義務が課される場合には、これを適切に行います。</li>
              <li>サーバーやクラウドサービスが外国に所在する事業者により運営されている場合など、個人データを外国にある第三者に提供することがあります。この場合、当社は、当該外国の名称、当該外国における個人情報の保護に関する制度その他個人情報保護法および関連ガイドラインで定められた事項について、ユーザーが確認できるよう情報提供または公表を行うとともに、個人情報保護法に従い適切な保護措置を講じます。</li>
            </ol>
          </section>

          {/* 第6条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第６条（外部送信・情報収集モジュール・Cookie等の利用）</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>当社は、本サービスの利用状況の分析、機能改善、障害対応等のため、アクセス解析ツールやクラッシュレポートツールなどの情報収集モジュールを利用する場合があります。この際、端末識別子、アプリ利用状況、クラッシュログ等が、各ツール提供事業者に送信されることがあります。</li>
              <li>当社が具体的に利用する情報収集モジュールの名称、提供者名、送信される情報の内容、送信先における利用目的等については、電気通信事業法その他の関連法令に基づく外部送信規律に従い、本ポリシーとは別に、本サービス内またはウェブサイト上に一覧を掲示します。</li>
              <li>本サービスでは、Cookieその他の類似技術を利用することがあります。これらは、ユーザーの利便性向上（ログイン状態の維持等）、利用状況の統計的分析、不正アクセスの検知等のために用いられます。</li>
              <li>ユーザーは、ブラウザの設定を変更することによりCookieの利用を制限または拒否することができます。ただし、Cookieを無効にした場合、本サービスの一部機能が利用できなくなることがあります。</li>
            </ol>
          </section>

          {/* 第7条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第７条（個人関連情報の取得・第三者からの提供）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              当社は、広告配信事業者等の第三者から、Cookie情報、広告識別子、閲覧履歴等の個人関連情報の提供を受け、これをユーザーの個人データと結び付けて分析・広告配信等に利用することがあります。その場合、当社は個人情報保護法の定めるところに従い、必要な同意取得・通知・公表等を行います。
            </p>
          </section>

          {/* 第8条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第８条（個人情報の安全管理措置）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              当社は、個人情報への不正アクセス、紛失、破壊、改ざんおよび漏えい等を防止するため、次のような措置を講じます。
            </p>
            <ol className="list-decimal list-inside space-y-4 text-sm text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">組織的安全管理措置</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>個人情報保護に関する社内規程の整備</li>
                  <li>個人情報を取り扱う者およびその範囲の明確化</li>
                  <li>取扱状況の定期的な点検・監査</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">人的安全管理措置</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>個人情報保護に関する教育・研修の実施</li>
                  <li>機密保持に関する誓約の取得</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">物理的安全管理措置</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>個人情報を取り扱う機器、電子媒体等の持出し制限および管理</li>
                  <li>盗難・紛失等の防止措置</li>
                </ul>
              </li>
              <li>
                <span className="font-medium text-foreground">技術的安全管理措置</span>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>アクセス権限の適切な設定および認証・認可管理</li>
                  <li>通信の暗号化、ファイアウォール等による不正アクセス防止</li>
                  <li>ログの取得・監視</li>
                </ul>
              </li>
            </ol>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              また、当社は、取得した個人情報を、利用目的の達成に必要な期間または法令により保存が義務付けられた期間保有し、その後は遅滞なく消去または匿名化するよう努めます。
            </p>
          </section>

          {/* 第9条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第９条（個人情報の開示・訂正・利用停止等）</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>
                ユーザーは、当社が保有する自己の保有個人データについて、個人情報保護法の定めに基づき、以下の請求を行うことができます。
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>開示の請求（第三者提供記録の開示を含む）</li>
                  <li>内容が事実でない場合の訂正、追加または削除の請求</li>
                  <li>利用停止または消去の請求</li>
                  <li>第三者提供の停止の請求</li>
                </ul>
              </li>
              <li>前項の請求を行う場合は、第１２条（お問い合わせ窓口）に定める方法により当社までご連絡ください。その際、当社は、本人確認のために必要な情報の提供を求めることがあります。</li>
              <li>当社は、法令に基づき、合理的な期間および範囲内で速やかに対応し、その結果を書面または電子的方法により通知します。</li>
              <li>個人情報保護法その他の法令により、当社が開示等の義務を負わない場合には、当該請求に応じないことがあります。</li>
            </ol>
          </section>

          {/* 第10条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１０条（未成年者の個人情報）</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>未成年のユーザーが本サービスを利用する場合、必ず親権者その他の法定代理人の同意を得たうえで、本サービスを利用してください。</li>
              <li>当社は、未成年のユーザーについて、必要に応じて親権者等の同意の有無を確認するための情報の提供を求めることがあります。</li>
              <li>当社は、ユーザーが未成年であることが判明し、親権者等の同意が得られていないおそれがあるときは、必要に応じてアカウントの利用制限、本サービスの利用停止その他適切な措置を講じることがあります。</li>
            </ol>
          </section>

          {/* 第11条 */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１１条（プライバシーポリシーの変更）</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li>当社は、法令の改正、サービス内容の変更等に応じて、本ポリシーの内容を変更することがあります。</li>
              <li>本ポリシーを変更する場合、当社は本サービス上での表示その他当社所定の方法により、変更内容および効力発生日を事前に公表またはユーザーに通知します。</li>
              <li>ユーザーが、本ポリシーの変更後も本サービスを利用した場合、当該変更内容に同意したものとみなします。</li>
            </ol>
          </section>

          {/* 第12条 */}
          {/* TODO */}
          <section className="rounded-xl border border-border bg-white shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">第１２条（お問い合わせ窓口）</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              本ポリシー、個人情報の取扱い、本サービスにおけるユーザー情報に関するご質問・ご相談・開示等のご請求は、ヘルプページのお問い合わせボタンよりご連絡ください。
            </p>
          </section>

          <p className="text-sm text-muted-foreground text-right mt-8">以上</p>
        </div>
      </main>
    </div>
  )
}
