"use client"
import { VapiAssistantsTab } from "./vapi-assistants-numbers-tab"

import { BotIcon, PhoneIcon, SettingsIcon, UnplugIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { VapiPhoneNumbersTab } from "./vapi-phone-numbers-tab"
interface VapiConnectedViewProps {
  onDisconnect: () => void
}

export function VapiConnectedView({ onDisconnect }: VapiConnectedViewProps) {
  const [activeTab, setActiveTab] = useState("phone-numbers")
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/vapi.png"
                alt="VAPI Connected"
                className="rounded-lg object-contain"
                width={40}
                height={40}
              />
              <div>
                <CardTitle>Vapi Integration</CardTitle>
                <CardDescription>
                  manage your phone numbers and ai assistants
                </CardDescription>
              </div>
            </div>
            <Button onClick={onDisconnect} size={"sm"} variant="destructive">
              <UnplugIcon className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
                <SettingsIcon className="size-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  set up voice calls for chat widget
                </CardDescription>
              </div>
            </div>
            <Button className="flex items-center gap-2" size={"sm"}>
              <SettingsIcon />
              <Link href="/customization">Configure</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
      <div className="overflow-hidden rounded-lg border bg-background">
        <Tabs
          className="gap-0"
          defaultValue="phone-numbers"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid h-12 w-full grid-cols-2 p-0">
            <TabsTrigger className="h-full rounded-none" value="phone-numbers">
              <PhoneIcon />
              phone numbers
            </TabsTrigger>
            <TabsTrigger className="h-full" value="ai-assistants">
              <BotIcon />
              ai assistants
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone-numbers">
            <VapiPhoneNumbersTab />
          </TabsContent>
          <TabsContent value="ai-assistants">
            <VapiAssistantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
