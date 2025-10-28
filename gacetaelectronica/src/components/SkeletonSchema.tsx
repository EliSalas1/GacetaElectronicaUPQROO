import { Skeleton } from "./ui/skeleton";

type SkeletonSchemaProps = {
  grid: number;
  variant: "logros" | "noticias" | "eventos" | "carousel";
};

const SkeletonSchema = ({ grid, variant }: SkeletonSchemaProps) => {
  if (variant === "carousel") {
    return (
      <div className="w-full justify-center px-4">
        <div className="max-w-7xl mx-auto justify-center flex gap-6 overflow-hidden">
          {Array.from({ length: grid }).map((_, index) => (
            <div key={index} className="w-full max-w-3xl flex-shrink-0">
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <div className="w-full md:flex flex-col md:flex-row">
                  {/* Lado izquierdo - texto */}
                  <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
                    <Skeleton className="h-4 w-24 mb-2 rounded-full" />
                    <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                    <Skeleton className="h-4 w-full mb-2 rounded" />
                    <Skeleton className="h-4 w-2/3 mb-3 rounded" />
                    <Skeleton className="h-3 w-1/2 mb-4 rounded" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>

                  {/* Lado derecho - imagen */}
                  <div className="w-full md:w-1/2 bg-gray-200 min-h-[200px] flex items-center justify-center">
                    <Skeleton className="w-14 h-14 bg-gray-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        variant === "noticias" || variant === "logros"
          ? "md:grid-cols-2"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: grid }).map((_, index) => {
        switch (variant) {
          case "noticias":
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3 flex flex-col flex-grow">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            );

          case "logros":
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-sm"
              >
                <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="w-12 h-6 rounded" />
              </div>
            );

          case "eventos":
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default SkeletonSchema;
