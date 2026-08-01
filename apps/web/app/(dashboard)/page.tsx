"use client"

import React, { use } from "react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { UserButton, SignInButton, OrganizationSwitcher } from "@clerk/nextjs"
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/orgaanization-guard"
export default function Page() {
  const users = useQuery(api.users.getMany)
  const addUser = useMutation(api.users.add)
  const handleAddUser = async () => {
    try {
      const newUser = await addUser()
      console.log("new user added", newUser)
    } catch (error) {
      toast.error("Error adding user: " + error)
      console.error(error)
    }
  }
  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-green-600 p-6">
      <p>Apps.web</p>
      <UserButton />
      <Button
        onClick={() => {
          handleAddUser()
        }}
      >
        add user
      </Button>
      <OrganizationSwitcher />
    </div>
  )
}
