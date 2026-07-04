import { ModeToggle } from "@/components/dss/mode-toggle"
import { SiteNav } from "@/components/dss/site-nav"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold">cam-dss</span>
          <SiteNav />
        </div>
        <ModeToggle />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
