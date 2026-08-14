"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@workspace/ui/components/tooltip"

interface HintProps {
  children: React.ReactElement
  text: string
  side: "top" | "bottom" | "left" | "right"
  align: "start" | "center" | "end"
}

export const Hint = ({
  children,
  text,
  side = "top",
  align = "center",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={children} />
        {/* <TooltipTrigger aschild="true">{children}</TooltipTrigger> */}
        <TooltipContent side={side} align={align}>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
