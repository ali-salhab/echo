"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@workspace/backend/_generated/api"
import type { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useMutation, useQuery } from "convex/react"
import { MoreHorizontal, Wand2Icon } from "lucide-react"
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react"
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ui/conversation"
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ui/input"
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ui/message"
import { AIResponse } from "@workspace/ui/components/ui/response"
import { Form, FormField } from "@workspace/ui/components/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { use } from "react"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import toast from "react-hot-toast"
const formSchema = z.object({
  message: z.string().min(1, {
    message: "Message is required.",
  }),
})

const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  })
  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId
      ? {
          threadid: conversation?.threadId || "",
        }
      : ("skip" as any),
    { initialNumItems: 10 }
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        prompt: values.message,
        conversationId,
      })
      form.reset()
    } catch (error) {
      console.error("Error creating message:", error)
      toast.error("Failed to send message. Please try again.")
    }
  }
  const createMessage = useMutation(api.private.messages.create)

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button variant="ghost" size={"sm"}>
          <MoreHorizontal></MoreHorizontal>
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {toUIMessages(messages.results ?? []).map((message) => (
            <AIMessage
              key={message.id}
              from={message.role === "assistant" ? "user" : "assistant"}
            >
              <AIMessageContent>
                <AIResponse>{message.text}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={(conversation?.contactSessionId as string) ?? undefined}
                  size={35}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      <div className="border-t p-2.5">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting
                    // TODO:
                  }
                  placeholder={
                    conversation?.status === "resolved"
                      ? "Conversation is resolved"
                      : "type your respose here as an agent"
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      form.handleSubmit(onSubmit)()
                    }
                  }}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Wand2Icon />
                  Enhance
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                status="ready"
                disabled={
                  !form.formState.isValid ||
                  conversation?.status === "resolved" ||
                  form.formState.isSubmitting ||
                  !form.getValues("message")
                }
                type="submit"
              >
                Send
              </AIInputSubmit>
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  )
}

export default ConversationIdView
