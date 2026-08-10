import { ArrowUpIcon, ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "../lib/utils.js"

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved"
}
const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgColor: "bg-[#3fb62f]",
  },
  unresolved: { icon: ArrowRightIcon, bgColor: "bg-destructive" },
  escalated: { icon: ArrowUpIcon, bgColor: "bg-yellow-500" },
} as const

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <div
      className={cn(
        "item-center flex justify-center rounded-full p-1.5",
        config.bgColor
      )}
    >
      <Icon className="size-4 stroke-3 text-white" />
    </div>
  )
}
