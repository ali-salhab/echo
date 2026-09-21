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
import { GlobeIcon, MailIcon, MonitorIcon } from "lucide-react"
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

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) return []
    return [
      {
        id: "device-info",
        title: "Device Information",
        icon: MonitorIcon,
        items: [
          {
            label: "Browser",
            value:
              userAgentInfo.browser +
              (userAgentInfo.browserVersion
                ? ` (${userAgentInfo.browserVersion})`
                : ""),
          },
          {
            label: "OS",
            value:
              userAgentInfo.os +
              (userAgentInfo.osVersion ? ` (${userAgentInfo.osVersion})` : ""),
          },
          {
            label: "Device",
            className: "capitalize",
            value:
              userAgentInfo.device +
              (userAgentInfo.deviceModel
                ? ` (${userAgentInfo.deviceModel})`
                : ""),
          },
          {
            label: "screen",
            value: contactSession.metadata.screenResolution,
          },
          {
            label: "view port",
            value: contactSession.metadata.viewportSize,
          },
          {
            label: "Cookies",
            value: contactSession.metadata.cookieEnabled
              ? "Enabled"
              : "Disabled",
          },
        ],
      },
      {
        id: "location-info",
        title: "Location Information",
        icon: GlobeIcon,
        items: [
          ...(countryInfo
            ? [
                {
                  label: "Country",
                  value: countryInfo?.name ?? "Unknown",
                },
              ]
            : []),

          {
            label: "language",
            value: contactSession.metadata.language ?? "Unknown",
          },
          {
            label: "UTC offset",
            value: contactSession.metadata.timezoneOffset ?? "Unknown",
          },
        ],
      },
    ]
  }, [userAgentInfo, contactSession, countryInfo])
  if (contactSession === undefined || contactSession === null) return null

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
      <div>
        {contactSession.metadata && (
          <Accordion
            className={"w-full rounded-none border-y"}
            // collapsible
            // type="single"
          >
            {accordionSections.map((section) => (
              <AccordionItem
                className={
                  "rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                }
                key={section.id}
                value={section.id}
              >
                <AccordionTrigger
                  className={
                    "flex w-full flex-1 items-start justify-between bg-accent px-5 py-4 text-left text-sm font-medium transition-all outline-none hover:no-underline disabled:pointer-events-none disabled:opacity-50"
                  }
                >
                  <div className="flex items-center gap-4">
                    {section.icon && <section.icon className="size-4" />}
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 py-4">
                  <div className="space-y-2 text-sm">
                    {section.items.map((item) => (
                      <div
                        key={`${section.id}-${item.label}`}
                        className="flex justify-between py-1"
                      >
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className={item.className}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
export default ContactPanel
