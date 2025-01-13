import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  bgColor: string
}

export function StatsCard({ title, value, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <Card className="bg-background border-[#15397F]">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-xl md:text-2xl font-bold ${color}`}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 