import React from "react"

interface Props {
  organizationId: string
}
const WidgetView = ({ organizationId }: Props) => {
  return <div>WidgetView: {organizationId}</div>
}

export default WidgetView
