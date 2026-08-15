import React from "react"
import { Button } from "@workspace/ui/components/button"
import { useAction } from "convex/react"
import { api } from "@workspace/backend/_generated/api"

const Test = () => {
  const uploadfile = useAction(api.private.files.addFile)

  return (
    <div className="animate-fade-up bg-ali-800 text-ali">
      we cant reach this page without login and having an organisation
      <Button>click</Button>
    </div>
  )
}

export default Test
