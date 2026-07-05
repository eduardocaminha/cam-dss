import { redirect } from "next/navigation"

import { componentGallery } from "@/components/dss/component-gallery"

export default function ComponentsIndexPage() {
  redirect(`/components/${componentGallery[0].slug}`)
}
