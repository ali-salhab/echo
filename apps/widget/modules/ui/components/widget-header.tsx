import { cn } from "@workspace/ui/lib/utils"
import React from "react"

const WidgetHeader = ({
  children,
  classname,
}: {
  children?: React.ReactNode
  classname?: string
}) => {
  return (
    <header
      className={cn(
        "rounded-t-lg border-t bg-linear-to-l from-primary to-[#0b63f3] p-4 text-primary-foreground",
        classname
      )}
    >
      {children}
    </header>
  )
}
export default WidgetHeader
