import React from "react"
import { Button } from "@workspace/ui/components/button"
import { HomeIcon, InboxIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const WidgetFooter = () => {
  const scrree = "selection"
  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size={"icon"}
        variant={"ghost"}
      >
        <HomeIcon
          className={cn("size-5", scrree === "selection" && "text-primary")}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => {}}
        size={"icon"}
        variant={"ghost"}
      >
        <InboxIcon
          className={cn("size-5", scrree === "inbox" && "text-primary")}
        />
      </Button>
    </footer>
  )
}

export default WidgetFooter
