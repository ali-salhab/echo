"use client"
import { CheckCircleIcon, PhoneIcon, XCircleIcon } from "lucide-react"

import { toast } from "sonner"
import { Badge } from "@workspace/ui/components/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useVapiAssistants } from "../hooks/use-vapi-data"
import { is } from "zod/locales"
export const VapiAssistantsTab = () => {
  const { isLoading, data: assistants } = useVapiAssistants()

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Assistant</TableHead>
            <TableHead className="px-6 py-4">Model</TableHead>
            <TableHead className="px-6 py-4 text-right">
              First message
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    className="px-6 py-4 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )
            }
            if (!isLoading && (!assistants || assistants.length === 0)) {
              return (
                <TableRow>
                  <TableCell
                    className="px-6 py-4 text-center text-muted-foreground"
                    colSpan={3}
                  >
                    No assistants configured.
                  </TableCell>
                </TableRow>
              )
            }
            return assistants.map((assistant) => (
              <TableRow className="hover:bg-muted/50" key={assistant.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span>{assistant.name || "unnamed Assistant"}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span>{assistant.model?.model || "N/A"}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="truncate text-sm text-muted-foreground">
                    {assistant.firstMessage || "N/A"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          })()}
        </TableBody>
      </Table>
    </div>
  )
}
