"use client"
import React, { useState } from "react"
import { PluginCard, type Feature } from "../components/plugin-card"
import { GlobeIcon, PhoneCallIcon, PhoneIcon, WorkflowIcon } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { toast } from "react-hot-toast"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { upsertSecret } from "@workspace/backend/lib/secrets"
import VapiPlugin from "@/app/(dashboard)/plugins/vapi/page"
const vapiFeatures: Feature[] = [
  {
    label: "Web Voice Calls",
    description: "Voice Chat Directky in your app",
    icon: GlobeIcon,
  },
  {
    label: "Phone numbers",
    description: "Get phone numbers for your app",
    icon: PhoneCallIcon,
  },
  {
    label: "outbound calls ",
    description: "Automated Customer outreach",
    icon: PhoneIcon,
  },
  {
    label: "WorkFlow",
    description: "Automate your workflow with ease",
    icon: WorkflowIcon,
  },
]
const formSchema = z.object({
  publicApiKey: z.string().min(1, "Public API Key is required"),
  privateApiKey: z.string().min(1, "Private API Key is required"),
})
const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert)
  const fomr = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      })
    } catch (error) {
      toast.error("Failed to update secrets")
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open Form</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vapi Plugin Configuration</DialogTitle>
          <DialogDescription>
            Enter your Vapi API keys to connect the plugin.
          </DialogDescription>
        </DialogHeader>
        <Form {...fomr}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={fomr.handleSubmit(onSubmit)}
          >
            <FormField
              control={fomr.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public API Key</FormLabel>
                  <FormControl>
                    <input {...field} placeholder="Your Api Key" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={fomr.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private API Key</FormLabel>
                  <FormControl>
                    <input {...field} placeholder="Your private Api Key" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>

          <DialogFooter>
            <button type="submit" disabled={fomr.formState.isSubmitting}>
              {fomr.formState.isSubmitting ? "connecting..." : "connect"}
            </button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const handleSubmit = () => {
  if (!VapiPlugin) {
    return
  }
}
const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" })
  const [connectedopen, setConnectedOpen] = useState(false)

  return (
    <>
      <VapiPluginForm open={connectedopen} setOpen={setConnectedOpen} />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to Enable Ai Voice Calls And phone Support
            </p>
          </div>
          {vapiPlugin ? (
            <p>connected!!</p>
          ) : (
            <PluginCard
              serviceName="Vapi "
              serviceImage="./logo.svg"
              features={vapiFeatures}
              isDisabled={vapiPlugin === undefined}
              onSubmit={() => {}}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default VapiView
