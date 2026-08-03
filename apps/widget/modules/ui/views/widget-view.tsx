import React from "react"
import WidgetFooter from "../components/widget-footer"
import WidgetHeader from "../components/widget-header"

interface Props {
  organizationId: string
}
const WidgetView = (p: Props) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-b-2xl border">
      <WidgetHeader>
        <div className="flex flex-col justify-between px-2 py-1">
          <p className="text-3xl font-semibold">hey there👌 </p>
          <p className="font-ligth text-lg"> How Can We help you Today ?</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1">{p.organizationId}</div>
      <WidgetFooter />
    </div>
  )
}

export default WidgetView
