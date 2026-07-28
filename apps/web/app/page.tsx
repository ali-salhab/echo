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
import { UserButton, SignInButton } from "@clerk/nextjs"
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
  console.log("users", users)
  return (
    <div className="flex min-h-screen flex-col p-6">
      <div className="fixed top-0 left-0 flex w-full justify-between bg-gray-500 p-3">
        <div>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </div>
        <div className="flex gap-3">
          <Button
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => {
              console.log("clicked")
            }}
          >
            home
          </Button>
          <Button
            onClick={() => {
              handleAddUser()
            }}
          >
            add user
          </Button>
        </div>
        <div>
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </div>
      </div>

      <div className="m-3 flex flex-col items-center justify-center gap-3 bg-amber-400 p-3">
        <h1 className="m-3 w-screen overflow-hidden bg-amber-600 p-2">
          {JSON.stringify(users)}
        </h1>
      </div>
    </div>
  )
}
