"use client"

import Bowser from "bowser"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion"
import {
  getCountryFlagUrl,
  getCountryFromTimezone,
} from "@/lib/countries-utils"
import { api } from "@workspace/backend/_generated/api"
import type { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { useQuery } from "convex/react"
import { MailIcon } from "lucide-react"
import Link from "next/dist/client/link"
import { useParams } from "next/navigation"
import React, { useMemo } from "react"
import { userAgent } from "next/server"

type InfoItem = {
  label: string
  value: string | React.ReactNode
  className?: string
}
type InfoSection = {
  id: string
  title: string
  items: InfoItem[]
  icon?: React.ComponentType<{ className?: string }>
}
export const ContactPanel = () => {
  const params = useParams()
  const conversationId = params.conversationId as Id<"conversations"> | null
  const contactSession = useQuery(
    api.private.contactSession.getOneByConversationId,
    conversationId
      ? {
          conversationId,
        }
      : "skip"
  )
  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metadata?.timezone)
  }, [contactSession?.metadata?.timezone])
  if (contactSession === undefined || contactSession === null) return null
  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent)
        return {
          browser: "Unknown",
          os: "Unknown",
          device: "unknown",
        }
      const browser = Bowser.getParser(userAgent)
      const result = browser.getResult()
      return {
        browser: result.browser.name ?? "Unknown",
        browserVersion: result.browser.version ?? "Unknown",
        os: result.os.name ?? "Unknown",
        osVersion: result.os.version ?? "Unknown",
        device: result.platform.type ?? "unknown",
        deviceVendor: result.platform.vendor ?? "unknown",
        deviceModel: result.platform.model ?? "unknown",
      }
    }
  }, [])
  const userAgentInfo = useMemo(
    () => parseUserAgent(contactSession?.metadata?.userAgent),
    [parseUserAgent, contactSession?.metadata?.userAgent]
  )
  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      Contact panel
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <DicebearAvatar
            size={42}
            badgeImageUrl={
              countryInfo?.code
                ? getCountryFlagUrl(countryInfo?.code)
                : undefined
            }
            imageUrl=""
            seed={contactSession?._id ?? ""}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-x-2">
              <h4 className="line-clamp-1">{contactSession?.name}</h4>
            </div>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {contactSession?.email}
            </p>
          </div>
        </div>
        <Button className="w-full">
          <Link href={`mailto:${contactSession?.email ?? ""}`}>
            <MailIcon className="size-3.5" />
            send email
          </Link>
        </Button>
      </div>
    </div>
  )
}
export default ContactPanel
