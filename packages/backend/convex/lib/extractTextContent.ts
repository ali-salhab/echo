import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { StorageActionWriter } from "convex/server"
import { assert } from "convex-helpers"
import type { Id } from "../_generated/dataModel"
const AI_MODELS = {
  image: google.chat("gemini-3.5-flash-lite"),
  pdf: google.chat("gemini-3.5-flash-lite"),
  html: google.chat("gemini-3.5-flash-lite"),
} as const
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const
const SYSTEM_PROMPTS = {
  image:
    "you turn images into text.if it is a photo of document,transcribe it . if it is not a document , describe it ",
  pdf: "you transform pdf files into text",
  html: "you transform content into markdown",
}
export type ExtractTextContextProps = {
  storageId: Id<"_storage">
  fileName: string
  bytes?: ArrayBuffer
  mimeType: string
}
export const extractTextContent = async (
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContextProps
): Promise<string> => {
  const { fileName, mimeType, storageId, bytes } = args
  const url = await ctx.storage.getUrl(storageId)
  assert(url, "failed to get storage url")
  if (
    SUPPORTED_IMAGE_TYPES.some((type) => {
      return type === mimeType
    })
  ) {
    return extractImageText(url)
  }
  if (mimeType.toLocaleLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, fileName)
  }
  if (mimeType.toLocaleLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType)
  }
  throw new Error(`Unsupported file type: ${mimeType} for file ${fileName}`)
}
const extractTextFileContent = async (
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> => {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer())
  if (!arrayBuffer) {
    throw new Error("Failed to get file content")
  }
  const text = new TextDecoder().decode(arrayBuffer)

  if (mimeType.toLocaleLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: text,
            },
            {
              type: "text",
              text: "extract the text and print it in markdown format without explaining you will do so",
            },
          ],
        },
      ],
    })
    return result.text
  }
  return text
}
const extractPdfText = async (
  url: string,
  mimeType: string,
  fileName: string
): Promise<string> => {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(url),
            mediaType: mimeType,
            filename: fileName,
          },
          {
            type: "text",
            text: "Extract the text from the Pdf and print it without explaining you will do so ",
          },
        ],
      },
    ],
  })
  return result.text
}
const extractImageText = async (url: string): Promise<string> => {
  //   we can use the image model to extract text from the image or describe the image if it is not a document
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL(url),
          },
        ],
      },
    ],
  })
  return result.text
}
