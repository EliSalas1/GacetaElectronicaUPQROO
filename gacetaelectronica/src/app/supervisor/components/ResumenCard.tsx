import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface ResumenCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  iconColor?: string
}

export default function ResumenCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-blue-600" 
}: ResumenCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
