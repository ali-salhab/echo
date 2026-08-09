"use client "
import { glass } from "@dicebear/collection"
import { AvatarImage, Avatar } from "@workspace/ui/components/avatar"
import { useMemo } from "react"
import { cn } from "../lib/utils.js"
import { Avatar as DicebearAvatarLib, Style } from "@dicebear/core"
interface DicebearAvatarProps {
  seed: string
  size?: number
  badgeClassName?: string
  className?: string
  imageUrl?: string
  badgeImageUrl?: string
}

export const DicebearAvatar = ({
  seed,
  size = 32,
  badgeClassName,
  className,
  imageUrl,
  badgeImageUrl,
}: DicebearAvatarProps) => {
  const avatarSrc = useMemo(() => {
    if (imageUrl) {
      return imageUrl
    }
    const style = new Style(glass)
    const avatar = new DicebearAvatarLib(style, {
      seed: seed.toLocaleLowerCase().trim(),
      size,
    })
    return avatar.toDataUri()
  }, [seed, size])
  const badgeSize = Math.round(size * 0.5)
  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <Avatar className={cn("border", className)}>
        <AvatarImage src={avatarSrc} alt="avatar" />
      </Avatar>
      {badgeImageUrl && (
        <div
          className={cn(
            "absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background",
            badgeClassName
          )}
          style={{
            width: badgeSize,
            height: badgeSize,
            transform: "translate(25%, 25%)",
          }}
        >
          <img
            src={badgeImageUrl}
            width={badgeSize}
            height={badgeSize}
            alt="badge"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}
