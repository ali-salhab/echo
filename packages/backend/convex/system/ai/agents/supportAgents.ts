import { google } from "@ai-sdk/google"
import { components } from "../../../_generated/api"
import { Agent, stepCountIs } from "@convex-dev/agent"
import { SUPPORT_AGENT_PROMPT } from "../constants"

const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-3.5-flash-lite"),
  instructions: SUPPORT_AGENT_PROMPT,

  // tools: { getWeather, getGeocoding },
  stopWhen: stepCountIs(3),
})

export { supportAgent }
