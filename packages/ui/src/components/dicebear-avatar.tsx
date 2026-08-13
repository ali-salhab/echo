"use client "
import { AvatarImage, Avatar } from "@workspace/ui/components/avatar"
import { useMemo } from "react"
import { cn } from "../lib/utils.js"
import { createAvatar } from "@dicebear/core"
import { glass } from "@dicebear/collection"
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
    if (imageUrl) return imageUrl

    return createAvatar(glass, {
      seed: [seed.toLowerCase().trim()],
      size,
    }).toDataUri()
  }, [imageUrl, seed, size])
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
