import Header from '@/components/header'
import Footer from '@/components/footer'

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">HELP</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">???</h1>
            <p className="text-muted-foreground">???????????????????????</p>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-neutral-soft/40 p-10 text-center text-muted-foreground">
            ???????????????????????????
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
