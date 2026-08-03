"use client"

import React, { use } from "react"

import WidgetView from "@/modules/ui/views/widget-view"

import WidgetFooter from "@/modules/ui/components/widget-footer"
interface Props {
  searchParams: Promise<{
    organizationId: string
  }>
}
export default function Page({ searchParams }: Props) {
  const { organizationId } = use(searchParams)
  return <WidgetView organizationId={organizationId} />
}
