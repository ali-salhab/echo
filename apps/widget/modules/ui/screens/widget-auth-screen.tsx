import React from "react"
import { WidgetHeader } from "../components/widget-header"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z, { email } from "zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { userAgent } from "next/server"
import type { Doc, Id } from "@workspace/backend/_generated/dataModel"
import { useAtomValue, useSetAtom } from "jotai"
import {
  contactSessionIdAtomFamilly,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms"

// steps to define forms
// 1. define the schema
// temporary organization id for testing purpose before add state management for organization id
const organizationId = "1234"
const formSchema = z.object({
  name: z.string().min(1, "Name is required "),
  email: z.string().email("Invalid email"),
})
const WidgetAuthScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamilly(organizationId || "")
  )
  type formData = z.infer<typeof formSchema>
  const contactSession = useMutation(api.public.contcactSession.create)
  const form = useForm<formData>({
    // resolver is to link the zod schema with react hook form and it will validate the form data based on the schema
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  })
  const onSubmit = async (values: formData) => {
    if (!organizationId) {
      return alert("Organization id is missing")
    }
    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),

      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "No referrer",
      currentUrl: window.location.href,
    }
    const contactSessionId = await contactSession({
      ...values,
      organizationId,
      metadata,
    })
    console.log("contact session id", contactSessionId)
    setContactSessionId(contactSessionId)
    setScreen("selection")
  }
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between px-2 py-1">
          <p className="text-3xl font-semibold">hey there👌 </p>
          <p className="font-ligth text-lg"> let &apos; s get you started </p>
        </div>
      </WidgetHeader>

      {/* this from shadcn library and it provide context for other components  */}
      <Form {...form}>
        {/* native form elemet for recieve the onsubmit action */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="felx flex-1 flex-col space-y-3 p-4"
        >
          <FormField
            // here we link the from with react hook form using name and controller
            control={form.control}
            name="name"
            render={({ field }) => {
              console.log(field)

              return (
                <FormItem>
                  <FormLabel> User Name</FormLabel>

                  <FormControl>
                    <Input
                      className="h-10 bg-background"
                      placeholder="eg ali doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            // here we link the from with react hook form using name and controller
            control={form.control}
            name="email"
            render={({ field }) => {
              console.log(field)

              return (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>

                  <FormControl>
                    <Input
                      className="h-10 bg-background"
                      placeholder="eg ali@do.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            Continue
          </Button>
        </form>
      </Form>
    </>
  )
}

export default WidgetAuthScreen
