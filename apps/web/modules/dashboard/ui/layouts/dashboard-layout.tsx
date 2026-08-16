import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/orgaanization-guard"
import { Provider } from "jotai"
import {
  SIDEBAR_COOKIE_NAME,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { cookies } from "next/headers"
import { AppSideBar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const cookieStore = await cookies()

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <OrganizationGuard>
        <Provider>
          <div className="min-h-screen flex-1">
            <SidebarProvider defaultOpen={defaultOpen} className="flex min-w-0">
              <AppSideBar />

              <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                {/* حاوية محتوى الصفحة (يمكن التمرير فيها وحدها دون أن يتحرك الزر) */}
                <div className="flex w-full min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </div>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  )
}
