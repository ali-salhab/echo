"use client"
import { Button } from "@workspace/ui/components/button"
import { multilple } from "@workspace/math/multiple"

import { Input } from "@workspace/ui/components/input"
import React, { use } from "react"
import { useQuery } from "convex/react"

import { api } from "@workspace/backend/api"
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-500 p-6">
      {multilple(25, 3)}
      <Input
        onChange={(e) => {
          console.log(e.target.value)
        }}
        onClick={() => {
          console.log("ali salhab")
        }}
      />
    </div>
  )
}
