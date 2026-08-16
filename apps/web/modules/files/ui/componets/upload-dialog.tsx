"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"
import { useAction } from "convex/react"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone"
import { api } from "@workspace/backend/_generated/api"
import { previousDay } from "date-fns"
interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileUploaded?: (a: string) => void
}

export const UploadDialoge = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    category: "",
    filename: "",
  })
  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFiles([file])
      console.log("file dropped", file.name)
      if (!uploadForm.filename) {
        setUploadForm((prev) => ({
          ...prev,
          filename: file.name,
        }))
      }
    }
  }
  const handleUpload = async () => {
    setIsUploading(true)
    try {
      const blob = uploadedFiles[0]
      if (!blob) {
        return
      }
      const filename = uploadForm.filename || blob.name
      await addFile({
        bytes: await blob.arrayBuffer(),
        fileName: filename,
        mimeType: blob.type || "text/plain",
        category: uploadForm.category,
      })
      onFileUploaded?.(filename)
      handleCancel()
    } catch (error) {
    } finally {
      setIsUploading(false)
    }
  }
  const handleCancel = () => {
    onOpenChange(false)
    setUploadedFiles([])
    setUploadForm({
      category: "",
      filename: "",
    })
  }
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            upload documents to your knowlege base for Ai-powererd search and
            retrival
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">category</Label>
            <Input
              type="text"
              value={uploadForm.category}
              placeholder="e.g.,Documetation , Support , Product"
              // className="w-full"
              id="category"
              onChange={(e) => {
                return setUploadForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <span className="text-xs text-muted-foreground">(optional)</span>
            <Input
              type="text"
              value={uploadForm.filename}
              placeholder="verride the default file name "
              className="w-full"
              id="filename"
              onChange={(e) => {
                return setUploadForm((prev) => ({
                  ...prev,
                  filename: e.target.value,
                }))
              }}
            />
          </div>
          <Dropzone
            disabled={isUploading}
            maxFiles={1}
            onDrop={handleFileDrop}
            src={uploadedFiles}
            accept={{
              "application/pdf": [".pdf"],
              "text/csv": [".csv"],
              "text/plain": [".txt"],
            }}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <DialogFooter>
          <Button
            disabled={isUploading}
            variant={"outline"}
            onClick={handleCancel}
          >
            cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              uploadedFiles.length === 0 || isUploading || !uploadForm.category
            }
          >
            {isUploading ? "Uploading...." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
