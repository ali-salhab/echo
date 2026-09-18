"use client"
import { api } from "@workspace/backend/_generated/api"
import { useQuery } from "convex/react"
import { Loader2Icon } from "lucide-react"
import { CustomizationForm } from "../components/customization-from"

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne)
  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  })
  if (widgetSettings === undefined || vapiPlugin === undefined) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2Icon className="animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading widget settings...</p>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
          <p className="text-muted-foreground">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>
        <div className="mt-8">
          <CustomizationForm
            hasVapiPlugin={!!vapiPlugin}
            initialData={widgetSettings}
          />
        </div>
      </div>
    </div>
  )
}
