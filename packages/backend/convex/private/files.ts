import { action, mutation, query, type QueryCtx } from "../_generated/server"
import { extractTextContent } from "../lib/extractTextContent"
import { ConvexError, v } from "convex/values"
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  RAG,
  vEntryId,
  type Entry,
  type EntryId,
} from "@convex-dev/rag"
import rag from "../system/ai/rag"
import { ca } from "zod/locales"
import type { Id } from "../_generated/dataModel"
import { paginationOptsValidator } from "convex/server"
// what is array buffer ??
// when use upload the file in the browser the browser convert it to a list of bytes we store theme in arraybuffer opject and send theme to the server
//
const guessMimeType = (fileName: string, bytes: ArrayBuffer): string => {
  return (
    guessMimeTypeFromExtension(fileName) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  )
}
export const addFile = action({
  args: {
    // / this is the file name of the file being uploaded
    fileName: v.string(),
    // this file type
    mimeType: v.string(),
    // the file content as bytes
    bytes: v.bytes(),
    // not thing important but we can use it to categorize the file if we want to
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }

    const org = identity.o as { id: string }
    const orgId = org?.id

    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const { fileName, bytes, category } = args
    const mimeType = args.mimeType || guessMimeType(fileName, bytes)
    const blob = new Blob([bytes], { type: mimeType })
    const storageId = await ctx.storage.store(blob)
    const text = await extractTextContent(ctx, {
      storageId,
      fileName,
      bytes,
      mimeType,
    })
    console.log("extracted text content", text)
    // here we gave the text content of the file to the RAG system to add it to the search space
    const { entryId, created } = await rag.add(ctx, {
      // SUPER IMPORTANT : what search space to add this to . you cant search across namespaces
      //  if not added , it will consdired global we dont want this
      namespace: orgId,
      text,
      title: fileName,
      metadata: {
        storageId,
        uploadedBy: orgId,
        fileName,
        category: category || "general",
      },
      contentHash: await contentHashFromArrayBuffer(bytes),
      //   to avoid duplicate files we can use content hash to check if the file already exists in the database
    })
    if (!created) {
      await ctx.storage.delete(storageId)
      throw new ConvexError({
        message: "File already exists",
        status: 400,
        code: "BAD_REQUEST",
      })
    }
    return {
      // here the url is the url to download the file from the storage system
      url: await ctx.storage.getUrl(storageId),
      //   the entryId is the id of the file in the RAG system
      entryId,
    }
  },
})

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const org = identity.o as { id: string }
    const orgId = org?.id
    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    })
    if (!namespace) {
      throw new ConvexError({
        message: "Namespace not found",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    })
    if (!entry) {
      throw new ConvexError({
        message: "Entry not found",
        status: 404,
        code: "NOT_FOUND",
      })
    }
    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        message: "You do not have permission to delete this file",
        status: 403,
        code: "FORBIDDEN",
      })
    }
    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata?.storageId as Id<"_storage">)
    }
    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    })
  },
})

export const list = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        message: "User is not authenticated",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }

    const org = identity.o as { id: string }
    const orgId = org?.id

    if (!orgId) {
      throw new ConvexError({
        message: "User is not in organization",
        status: 401,
        code: "UNAUTHORIZED",
      })
    }
    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    })
    if (!namespace) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      }
    }
    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,

      paginationOpts: args.paginationOpts,
    })
    const files = await Promise.all(
      results.page.map(async (entry) => {
        return convertEntryToPublicFile(ctx, entry)
      })
    )
    const filteredFiles = args.category
      ? files.filter((file) => file.category === args.category)
      : files
    return {
      page: filteredFiles,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    }
  },
})
export type PublicFile = {
  id: EntryId
  name: string
  type: string
  size: string
  url: string | null
  category: string
  status: "ready" | "processing" | "error"
}
type EntryMetadata = {
  storageId: Id<"_storage">
  uploadedBy: string
  fileName: string
  category: string | null
}
const convertEntryToPublicFile = async (
  ctx: QueryCtx,
  entry: Entry
): Promise<PublicFile> => {
  const metadata = entry.metadata as EntryMetadata | undefined
  const storageId = metadata?.storageId
  let fileSize = "unknown"
  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId)
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size)
      }
    } catch (error) {
      console.error("Error fetching storage metadata:", error)
    }
  }
  const filename = entry.key || "unknown"
  const extension = filename.split(".").pop()?.toLocaleLowerCase() || "txt"
  let status: "ready" | "processing" | "error" = "error"
  if (entry.status === "ready") {
    status = "ready"
  } else if (entry.status === "pending") {
    status = "processing"
  }
  const url = storageId ? await ctx.storage.getUrl(storageId) : null
  return {
    id: entry.entryId,
    name: filename,
    type: extension,
    size: fileSize,
    url,
    category: metadata?.category || "",
    status,
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
