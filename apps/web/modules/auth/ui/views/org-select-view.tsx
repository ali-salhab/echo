import { OrganizationList } from "@clerk/nextjs"

export const OrgSelectView = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <OrganizationList
        afterCreateOrganizationUrl={"/fuck"}
        afterSelectOrganizationUrl={""}
        hidePersonal
        skipInvitationScreen
      />
    </div>
  )
}
