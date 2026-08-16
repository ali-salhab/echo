"use client"
import { useOrganization } from "@clerk/nextjs"
import AuthLayout from "../layouts/auth-layout"
import { OrgSelectView } from "../views/org-select-view"

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { organization } = useOrganization()
  console.log(organization)
  if (!organization) {
    return <OrgSelectView />
  }

  return <div>{children}</div>
}
