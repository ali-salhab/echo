import type { widgetSettingsSchema } from "./schemas"
import type { z } from "zod"

export type FormSchema = z.infer<typeof widgetSettingsSchema>
