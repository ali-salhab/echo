import { atom } from "jotai"
import type { WidgetScreen } from "../types"

// basix widget state atoms
export const screenAtom = atom<WidgetScreen>("auth")
