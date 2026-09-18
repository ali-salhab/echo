import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Textarea } from "@workspace/ui/components/textarea"
import type { Doc } from "@workspace/backend/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { VapiFormFields } from "./vapi-form-fields"
import type { widgetSettingsSchema } from "../../schemas"

type WidgetSetting = Doc<"widgetSettings">
interface CustomizationFormProps {
  initialData: WidgetSetting | null
  hasVapiPlugin: boolean
}
export type FormSchema = z.infer<typeof widgetSettingsSchema>
export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert)
  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage ?? "hi how can i help you?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 ?? "",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 ?? "",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 ?? "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId ?? "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber ?? "",
      },
    },
  })
  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSetting["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      }
      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggesstions: values.defaultSuggestions,
        vapiSettings,
      })
      toast.success("Widget settings updated successfully")
    } catch (error) {
      toast.error("Failed to update widget settings")
    }
  }
  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Generate Chat Settings</CardTitle>
            <CardDescription>
              Configure the settings for the chat widget and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="welcome message show when chat open"
                      rows={3}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  These suggestions will be shown to users by default in the
                  chat widget.
                </p>
              </div>

              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Suggestion 1</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., how i get started" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Suggestion 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., what are your pricing plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Suggestion 3</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., I need help with my account"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant settings</CardTitle>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure basic chat behavior for the voice assistant.
                </p>
              </CardContent>
            </CardHeader>
            <CardContent className="space-y-6">
              <VapiFormFields form={form} disabled={false} />
            </CardContent>
          </Card>
        )}
        <div>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
