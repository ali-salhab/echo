"use client"

import React, { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
export default function Page() {
  const users = useQuery(api.users.getMany)
  console.log("users", users)
  return (
    <div className="flex min-h-screen flex-col bg-amber-500 p-6">
      <h1>widget app</h1>
      <h1>{users ? `Users: ${users[0]?.name}` : "Loading..."}</h1>
    </div>
  )
}
