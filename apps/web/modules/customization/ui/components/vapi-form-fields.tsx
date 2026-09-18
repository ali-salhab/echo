import type { UseFormReturn } from "react-hook-form"
import { Input } from "@workspace/ui/components/input"
import z from "zod"
import type { FormSchema } from "./customization-from"
import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/ui/hooks/use-vapi-data"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form"
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@workspace/ui/components/select"
interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>
  disabled?: boolean
}
export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants()
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers()
  const disabled = form.formState.isSubmitting
  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display assistant ID</FormLabel>

            <Select
              disabled={disabled || assistantsLoading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading assistants..."
                        : "Select an assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {assistants?.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Unnamed Assistant"} -{" "}
                    {assistant.model?.model || "Unknown Model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>the vapi assistant to use for voice calls</p>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Phone Number</FormLabel>

            <Select
              disabled={disabled || phoneNumbersLoading}
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {phoneNumbers?.map((phoneNumber) => (
                  <SelectItem
                    key={phoneNumber.id}
                    value={phoneNumber.id || phoneNumber.number}
                  >
                    {phoneNumber.number || "Unnamed Phone Number"} -{" "}
                    {phoneNumber.name || "Unknown Name"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>Phone number to use for voice calls</p>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
