import React from "react"
import { useAtomValue } from "jotai"
import { AlertTriangleIcon } from "lucide-react"
import { errorMessageAtom } from "../../widget/atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom)
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between px-2 py-1">
          <p className="text-3xl font-semibold">hey there👌 </p>
          <p className="font-ligth text-lg"> let &apos; s get you started </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon className="size-12" />
        <p className="text-sm">{errorMessage ?? "error not defined"}</p>
      </div>
    </>
  )
}

export default WidgetErrorScreen
