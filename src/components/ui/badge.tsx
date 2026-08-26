import * as React from "react"
import { badgeVariants, type BadgeProps } from "./badge-variants"

import { cn } from "@/lib/utils"

function Badge({ className, variant, ...props }: BadgeProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
