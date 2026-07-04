export type Block = {
  slug: string
  title: string
}

export type BlockFamily = {
  family: string
  blocks: Block[]
}

export const blockFamilies: BlockFamily[] = [
  {
    family: "Dashboard",
    blocks: [
      { slug: "dashboard-01", title: "A dashboard with sidebar, charts and data table." },
    ],
  },
  {
    family: "Sidebar",
    blocks: [
      { slug: "sidebar-01", title: "A simple sidebar with navigation grouped by section." },
      { slug: "sidebar-02", title: "A sidebar with collapsible sections." },
      { slug: "sidebar-03", title: "A sidebar with submenus." },
      { slug: "sidebar-04", title: "A floating sidebar with submenus." },
      { slug: "sidebar-05", title: "A sidebar with collapsible submenus." },
      { slug: "sidebar-06", title: "A sidebar with submenus as dropdowns." },
      { slug: "sidebar-07", title: "A sidebar that collapses to icons." },
      { slug: "sidebar-08", title: "An inset sidebar with secondary navigation." },
      { slug: "sidebar-09", title: "Collapsible nested sidebars." },
      { slug: "sidebar-10", title: "A sidebar in a popover." },
      { slug: "sidebar-11", title: "A sidebar with a collapsible file tree." },
      { slug: "sidebar-12", title: "A sidebar with a calendar." },
      { slug: "sidebar-13", title: "A sidebar in a dialog." },
      { slug: "sidebar-14", title: "A sidebar on the right." },
      { slug: "sidebar-15", title: "A left and right sidebar." },
      { slug: "sidebar-16", title: "A sidebar with a sticky site header." },
    ],
  },
  {
    family: "Login",
    blocks: [
      { slug: "login-01", title: "A simple login form." },
      { slug: "login-02", title: "A two column login page with a cover image." },
      { slug: "login-03", title: "A login page with a muted background color." },
      { slug: "login-04", title: "A login page with form and image." },
      { slug: "login-05", title: "A simple email-only login page." },
    ],
  },
  {
    family: "Signup",
    blocks: [
      { slug: "signup-01", title: "A simple signup form." },
      { slug: "signup-02", title: "A two column signup page with a cover image." },
      { slug: "signup-03", title: "A signup page with a muted background color." },
      { slug: "signup-04", title: "A signup page with form and image." },
      { slug: "signup-05", title: "A simple signup form with social providers." },
    ],
  },
]
