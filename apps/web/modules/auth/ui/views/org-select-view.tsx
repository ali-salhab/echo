import { OrganizationList } from "@clerk/nextjs"

export const OrgSelectView = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-green-500 p-16">
      <OrganizationList
        afterCreateOrganizationUrl={"/"}
        afterSelectOrganizationUrl={""}
        hidePersonal
        skipInvitationScreen
      />
    </div>
  )
}
