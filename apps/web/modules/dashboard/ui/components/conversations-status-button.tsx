import { Doc } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { Hint } from "@workspace/ui/components/hint"
import { ArrowUpIcon, CheckIcon } from "lucide-react"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
export const ConversationsStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"]
  onClick: () => void
  disabled?: boolean
}) => {
  if (status === "resolved") {
    return (
      <TooltipProvider>
        <Hint text="mark as unresolved" side="top" align="center">
          <Button
            disabled={disabled}
            size={"sm"}
            variant={"tertiary"}
            onClick={onClick}
          >
            <CheckIcon />
            resolved
          </Button>
        </Hint>
      </TooltipProvider>
    )
  }
  if (status === "escalated") {
    return (
      <Hint text="mark as resolved" side="top" align="center">
        <Button
          disabled={disabled}
          size={"sm"}
          variant={"warning"}
          onClick={onClick}
        >
          <ArrowUpIcon />
          escalated
        </Button>
      </Hint>
    )
  }
  return (
    <Hint text="mark as escalated" side="top" align="center">
      <Button
        disabled={disabled}
        size={"sm"}
        variant={"destructive"}
        onClick={onClick}
      >
        unresolvedd
      </Button>
    </Hint>
  )
}
