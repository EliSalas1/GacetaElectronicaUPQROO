import ArticleCard from "./articleCard";
import { featuredNotices } from "@/entities/article";

export default function ArticleContainer() {
  const article = featuredNotices[0]; // Simula el fetch

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <ArticleCard article={article} />
    </div>
  );
}