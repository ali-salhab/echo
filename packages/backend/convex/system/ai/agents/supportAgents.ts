import { google } from "@ai-sdk/google"
import { components } from "../../../_generated/api"
import { Agent, stepCountIs } from "@convex-dev/agent"

const supportAgent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: google.chat("gemini-3.5-flash-lite"),
  instructions:
    `You are a customer support agent. ` +
    `Use "resolveConversation" tool when user expresses finalization of the conversation. ` +
    `Use "escalateConversation" tool when user expresses frustration or need for human explicitly. ` +
    `Always respond in a helpful and professional manner.`,
  // tools: { getWeather, getGeocoding },
  stopWhen: stepCountIs(3),
})

export { supportAgent }
