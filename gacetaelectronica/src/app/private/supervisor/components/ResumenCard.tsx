import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ResumenCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function ResumenCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
}: ResumenCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${iconColor}`} />
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="text-xl sm:text-2xl font-bold text-gray-900">
          {value}
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-tight">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
