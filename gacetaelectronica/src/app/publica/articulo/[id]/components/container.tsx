"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleCard from "./articleCard";
import { getArticleById } from "../services/article.service";

export default function ArticleContainer() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getArticleById(Number(id))
      .then(setArticle)
      .catch(() => setError("No se pudo cargar el artículo"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error || !article) return <div className="text-center py-8">{error || "Artículo no encontrado"}</div>;

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <ArticleCard article={article} />
    </div>
  );
}