"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@workspace/backend/_generated/api"
import type { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useAction, useMutation, useQuery } from "convex/react"
import { MoreHorizontal, MoreHorizontalIcon, Wand2Icon } from "lucide-react"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScroolTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
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
import { use, useState } from "react"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import toast from "react-hot-toast"
import { ConversationsStatusButton } from "../components/conversations-status-button"
import { cn } from "@workspace/ui/lib/utils"
import { Skeleton } from "@workspace/ui/components/skeleton"
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

  const {
    topElementRef,
    canLoadMore,
    handleLoadMore,
    isExhausted,
    isLoadingMore,
  } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
  const [isEnhancing, setIsEnhancing] = useState(false)
  const enhanceResponse = useAction(api.private.messages.enhanceresponse)
  const handleEnhanceResponse = async () => {
    const message = form.getValues("message")
    if (!message) {
      toast.error("Message is empty. Please enter a message to enhance.")
      return
    }
    try {
      setIsEnhancing(true)
      const enhancedMessage = await enhanceResponse({ prompt: message })
      form.setValue("message", enhancedMessage)
    } catch (error) {
      console.error("Error enhancing message:", error)
      toast.error("Failed to enhance message. Please try again.")
    } finally {
      setIsEnhancing(false)
    }
  }
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const createMessage = useMutation(api.private.messages.create)
  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  )
  const handleToggleStatus = async () => {
    console.log("................................clicked")
    // cycle through the statuses: unresolved -> escalated -> resolved -> unresolved
    if (!conversation) return
    setIsUpdatingStatus(true)
    let newStatus: "unresolved" | "escalated" | "resolved"
    if (conversation.status === "unresolved") {
      console.log("changing status from unresolved to escalated")
      newStatus = "escalated"
    } else if (conversation.status === "escalated") {
      console.log("changing status from escalated to resolved")
      newStatus = "resolved"
    } else {
      console.log("changing status from resolved to unresolved")
      newStatus = "unresolved"
    }
    try {
      console.log("updating status to", newStatus)
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      })
    } catch (error) {
      console.error("Error updating conversation status:", error)
      toast.error("Failed to update conversation status. Please try again.")
    } finally {
      setIsUpdatingStatus(false)
    }
  }
  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />
  }
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button variant="ghost" size={"sm"}>
          <MoreHorizontal></MoreHorizontal>
        </Button>
        {conversation && (
          <ConversationsStatusButton
            status={conversation.status}
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScroolTrigger
            ref={topElementRef}
            isLoadingMore={isLoadingMore}
            canLoadMore={canLoadMore}
            onLoadMore={handleLoadMore}
          />
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
                    form.formState.isSubmitting ||
                    isEnhancing
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
                <AIInputButton
                  onClick={handleEnhanceResponse}
                  disabled={
                    conversation?.status === "resolved" ||
                    isEnhancing ||
                    !form.formState.isValid
                  }
                >
                  <Wand2Icon />
                  {isEnhancing ? "Enhancing..." : "Enhance"}
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
export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0
            const widths = ["w-48", "w-60", "w-72"]
            const width = widths[index % widths.length]
            return (
              <div
                key={index}
                className={cn(
                  "group flex w-full items-end justify-end gap-2 p-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
              >
                <Skeleton
                  className={`h-9 ${width} rounded-lg bg-neutral-400`}
                />
                <Skeleton className={`size-8 rounded-lg bg-neutral-400`} />
              </div>
            )
          })}
        </AIConversationContent>
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="type your respose here as an agent"
          />
          <AIInputToolbar />
          <AIInputTools />
          <AIInputSubmit status="ready" disabled type="submit">
            Send
          </AIInputSubmit>
        </AIInput>
      </div>
    </div>
  )
}
