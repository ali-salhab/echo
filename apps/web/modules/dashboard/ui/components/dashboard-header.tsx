"use client"

import { SidebarTrigger, useSidebar } from "@workspace/ui/components/sidebar"

export const DashboardHeader = () => {
  // نقوم بقراءة حالة السايدبار مباشرة هنا
  const { state } = useSidebar() // state تعود بـ "expanded" أو "collapsed"

  return (
    <header className="fixed top-0 px-4">
      {true && <SidebarTrigger variant="outline" className="h-8 w-8" />}
    </header>
  )
}
