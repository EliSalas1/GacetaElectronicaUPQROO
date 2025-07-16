import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton() {
  return (
    <div className="border rounded p-4 shadow">
      <Skeleton className="h-4 w-24 mb-2" /> {/* etiqueta */}
      <Skeleton className="h-6 w-48 mb-2" /> {/* título */}
      <Skeleton className="h-4 w-32 mb-1" /> {/* autor y fecha */}
      <Skeleton className="h-4 w-full mb-1" /> {/* resumen */}
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}