import { ComponentsNav } from "@/components/dss/components-nav"

export default function ComponentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex">
      <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-48 shrink-0 overflow-y-auto border-r p-4 lg:block">
        <ComponentsNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
