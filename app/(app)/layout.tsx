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
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold">cam-dss</span>
          <SiteNav />
        </div>
        <div className="flex items-center gap-2">
          <ThemeMenu initialTheme={initialTheme} />
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
