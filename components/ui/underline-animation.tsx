'use client'

import { cn } from "@/lib/utils"

interface UnderlineProps {
  label: string
  direction?: "left" | "right"
  className?: string
}

export function CenterUnderline({ label, className }: Omit<UnderlineProps, "direction">) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden text-[#15397F] transition-colors hover:text-[#FFDA00]",
        className
      )}
    >
      {label}
      <div className="absolute bottom-0 h-[2px] w-full translate-y-1 bg-[#FFDA00] transition-transform duration-300 group-hover:translate-y-0" />
    </div>
  )
}

export function ComesInGoesOutUnderline({
  label,
  direction = "left",
  className,
}: UnderlineProps) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden text-[#15397F] transition-colors hover:text-[#FFDA00]",
        className
      )}
    >
      {label}
      <div
        className={cn(
          "absolute bottom-0 h-[2px] w-full bg-[#FFDA00] transition-transform duration-300",
          direction === "left"
            ? "-translate-x-full group-hover:translate-x-0"
            : "translate-x-full group-hover:translate-x-0"
        )}
      />
    </div>
  )
}

export function GoesOutComesInUnderline({
  label,
  direction = "left",
  className,
}: UnderlineProps) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden text-[#15397F] transition-colors hover:text-[#FFDA00]",
        className
      )}
    >
      {label}
      <div
        className={cn(
          "absolute bottom-0 h-[2px] w-full bg-[#FFDA00] transition-transform duration-300 group-hover:",
          direction === "left"
            ? "translate-x-0 group-hover:translate-x-full"
            : "translate-x-0 group-hover:-translate-x-full"
        )}
      />
    </div>
  )
}