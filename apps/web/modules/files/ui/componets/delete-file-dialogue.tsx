"use client"
import { useMutation } from "convex/react"

import { useState } from "react"

import { Button } from "@workspace/ui/components/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { api } from "@workspace/backend/_generated/api"
import { PublicFile } from "@workspace/backend/private/files"

interface DeleteFileDialogProps {
  open: boolean
  file: PublicFile | null
  onDelete?: () => void
  onOpenChange: (open: boolean) => void
}
export const DeleteDialog = ({
  file,
  onOpenChange,
  open,
  onDelete,
}: DeleteFileDialogProps) => {
  const deleteFile = useMutation(api.private.files.deleteFile)
  const [isDeleting, setIsDeleting] = useState(false)
  const handleDelete = async () => {
    if (!file) return
    setIsDeleting(true)
    try {
      await deleteFile({
        entryId: file.id,
      })
      onDelete?.()
      onOpenChange(false)
    } catch (error) {
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you went to delete this file ? this action cant be
            undone
          </DialogDescription>
        </DialogHeader>
        {file && (
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                type:{file.type.toLocaleUpperCase()} | size: {file.size}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            disabled={isDeleting}
            variant={"ghost"}
            onClick={() => {
              return onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting || !file}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting...." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
