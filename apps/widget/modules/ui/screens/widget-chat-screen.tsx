import React, { useState } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { WidgetHeader } from "../components/widget-header"
import { Button } from "@workspace/ui/components/button"
import { ArrowLeftIcon, MenuIcon, MessagesSquare } from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import {
  contactSessionIdAtomFamilly,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms"
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { Form, FormField } from "@workspace/ui/components/form"
import { InfiniteScroolTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ui/conversation"
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ui/input"
import { AIResponse } from "@workspace/ui/components/ui/response"
import {
  AISuggestions,
  AISuggestion,
} from "@workspace/ui/components/ui/suggestion"
import type { Id } from "@workspace/backend/_generated/dataModel"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ui/message"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

// =================================
const WidgetChatScreen = () => {
  const [prompt, setPrompt] = useState<string>("")
  const setScreen = useSetAtom(screenAtom)
  const setConversationId = useSetAtom(conversationIdAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamilly(organizationId || "")
  )
  const conversationId = useAtomValue(conversationIdAtom)
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  )

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadid: conversation.threadId, // مطابقة تماماً لـ threadid في الـ args
          contactSessionId,
        }
      : ("skip" as any),
    {
      initialNumItems: 10,
    }
  )
  const {
    topElementRef,
    handleLoadMore,
    isLoadingMore,
    canLoadMore,
    isLoadingFirstPage,
    isExhausted,
  } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
    observerEnabled: true,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
  const onBackClick = () => {
    setScreen("selection")
    // setConversationId(null)
  }

  const createMessage = useAction(api.public.messages.create)
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return
    }
    form.reset()
    try {
      await createMessage({
        prompt: value.message,
        threadid: conversation?.threadId || "",
        contactSessionId: contactSessionId as Id<"contactSessions">,
      })
      setPrompt("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }
  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBackClick} size="icon" variant="trasparent">
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size="icon" variant="trasparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      {/* messages area */}
      <AIConversation>
        <AIConversationContent>
          {/*  */}
          <InfiniteScroolTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />

          {(toUIMessages(messages.results) ?? ["a"]).map((message) => {
            console.log("-------------------------------")
            console.log(message)
            console.log("-------------------------------")
            return (
              <AIMessage
                key={message.id}
                from={message.role === "user" ? "user" : "assistant"}
              >
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {/* TODO: add Avatar component  */}
                {message.role === "assistant" && (
                  <DicebearAvatar
                    seed="assistant"
                    size={35}
                    imageUrl="/logo.svg"
                  />
                )}
              </AIMessage>
            )
          })}
        </AIConversationContent>
      </AIConversation>
      {/* Add suggestions */}
      {/* form */}
      <Form {...form}>
        <AIInput
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-none border-x-0"
        >
          <FormField
            control={form.control}
            disabled={conversation?.status === "resolved"}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                value={field.value}
                placeholder={
                  conversation?.status === "resolved"
                    ? "Conversation is resolved"
                    : "Type your message..."
                }
                disabled={conversation?.status === "resolved"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    form.handleSubmit(onSubmit)()
                  }
                }}
                onChange={field.onChange}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools></AIInputTools>
            <AIInputSubmit>
              {/* <Button
                type="submit"
                disabled={
                  conversation?.status === "resolved" || !form.formState.isValid
                }
              >
                Send
              </Button> */}
            </AIInputSubmit>
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  )
}

export default WidgetChatScreen
