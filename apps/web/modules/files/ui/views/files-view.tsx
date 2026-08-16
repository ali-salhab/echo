"use client"
import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Badge } from "@workspace/ui/components/badge"
import { InfiniteScroolTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { usePaginatedQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { PublicFile } from "@workspace/backend/private/files"
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { UploadDialoge } from "../componets/upload-dialog"
import { DeleteDialog } from "../componets/delete-file-dialogue"
const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  )

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
    isExhausted,
  } = useInfiniteScroll({
    status: files.status,
    loadSize: 10,
    loadMore: files.loadMore,
  })
  const [uploadDiallogueOpen, setUploadDialogueOpen] = useState(false)
  const [deleteDiallogueOpen, setDeleteDialogueOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null)

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file)
    setDeleteDialogueOpen(true)
  }
  const handleFileDeleted = () => {
    setSelectedFile(null)
  }
  const onFileUploaded = (a: string) => {
    console.log(a)
  }
  console.log("i-------------------------------r-----------------------e")
  console.log("files", files)
  return (
    <>
      <DeleteDialog
        file={selectedFile}
        onDelete={handleFileDeleted}
        open={deleteDiallogueOpen}
        onOpenChange={setDeleteDialogueOpen}
      />
      <UploadDialoge
        onFileUploaded={onFileUploaded}
        open={uploadDiallogueOpen}
        onOpenChange={setUploadDialogueOpen}
      />
      <div className="min-h-full w-full min-w-0 bg-muted p-2">
        <div>
          <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Upload and manage documents for your AI assistant
          </p>
          <div className="mt-8 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-6 py-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setUploadDialogueOpen(true)
                }}
              >
                <PlusIcon />
                Add New File
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                  <TableHead className="px-6 py-4 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className="px-6 py-4" colSpan={4}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    )
                  }
                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell
                          className="px-6 py-4 text-center"
                          colSpan={4}
                        >
                          No files found.
                        </TableCell>
                      </TableRow>
                    )
                  }
                  return files.results.map((file: PublicFile) => (
                    <TableRow className="hover:bg-muted/50" key={file.id}>
                      <TableCell className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <FileIcon />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium">
                        <Badge className="uppercase" variant={"outline"}>
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-muted-foreground">
                        {file.size}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="size-8 p-0 hover:bg-muted"
                            onClick={() => {
                              console.log("Menu trigger clicked")
                            }}
                          >
                            <MoreHorizontalIcon className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() => {
                                handleDeleteClick(file)
                              }}
                              className="text-destructive"
                            >
                              <TrashIcon />
                              Delete
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>Delete</DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-b">
                <InfiniteScroolTrigger
                  ref={topElementRef}
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default FilesView
