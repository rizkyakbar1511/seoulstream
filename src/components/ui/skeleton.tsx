import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "bg-accent rounded-md relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "animate-pulse",
        glare: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent before:animate-shine"
      }
    },
    defaultVariants: {
      variant: "glare"
    },
  }
)

function Skeleton({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Skeleton }
