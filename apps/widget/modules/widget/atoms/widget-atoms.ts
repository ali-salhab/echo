import { atom } from "jotai"
import type { WidgetScreen } from "../types"
import { atomFamily, atomWithStorage } from "jotai/utils"
import { CONTACT_SESSION_KEY } from "../constants"
import type { Id } from "@workspace/backend/_generated/dataModel"

// basix widget state atoms
export const screenAtom = atom<WidgetScreen>("loading")
export const errorMessageAtom = atom<string | null>(null)
export const loadingMessageAtom = atom<String | null>(null)
export const organizationIdAtom = atom<string | null>(null)
// organisation-scoped contact session atom

export const contactSessionIdAtomFamilly = atomFamily(
  (organizationId: string) =>
    atomWithStorage<Id<"contactSessions"> | null>(
      `${CONTACT_SESSION_KEY}_${organizationId}`,
      null
    )
)

export const conversationIdAtom = atom<Id<"conversations"> | null>(null)
