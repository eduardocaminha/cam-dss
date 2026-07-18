import { ModeToggle } from "@/components/dss/mode-toggle"
import { SiteNav } from "@/components/dss/site-nav"
import { ThemeMenu } from "@/components/dss/theme-menu"
import { getCurrentTheme } from "@/lib/theme-actions"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialTheme = await getCurrentTheme()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
        <div className="flex min-w-0 items-center gap-6">
          <span className="shrink-0 text-sm font-semibold">cam-dss</span>
          <SiteNav />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeMenu initialTheme={initialTheme} />
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
