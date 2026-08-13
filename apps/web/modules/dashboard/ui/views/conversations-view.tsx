import Image from "next/image"
export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 flex-col items-center justify-center gap-x-2">
        <Image
          src="/logo.png"
          alt="Empty conversations"
          width={40}
          height={40}
        />
        <p className="text-lg font-semibold">Echo</p>
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    </div>
  )
}
