import { ArrowLeftRightIcon, type LucideIcon, PlugIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@workspace/ui/components/button"

export interface Feature {
  label: string
  description: string
  icon: LucideIcon
}

interface PluginCardProps {
  isDisabled?: boolean
  serviceName: string
  serviceImage: string
  features: Feature[]
  onSubmit: () => void
}
export const PluginCard = ({
  isDisabled,
  serviceName,
  serviceImage,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-lg border bg-background p-8">
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <Image
            className="rounded object-contain"
            src={serviceImage}
            alt={serviceName}
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <ArrowLeftRightIcon />
          <div className="flex flex-col items-center">
            <Image
              className="rounded object-contain"
              src={"/logo.png"}
              alt={"platform"}
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>
      <div className="mb-6 text-center">
        <p className="text-lg">
          <span>Conntect your {serviceName} Account</span>
        </p>
      </div>
      <div className="mb-6">
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-4">
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                <feature.icon className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{feature.label}</div>
                <div className="text-xs text-muted-foreground">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button onClick={onSubmit} disabled={isDisabled} className="size-full">
          Connect to {serviceName}
          <PlugIcon className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  )
}
