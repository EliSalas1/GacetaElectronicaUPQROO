"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // ✅ import correcto
import ArticleCard from "./articleCard";
import { getArticleById } from "../services/article.service";

export default function ArticleContainer() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    getArticleById(Number(id))
      .then((res) => {
        if (!res) {
          router.push("/"); // redirige si no se encontró
        } else {
          setArticle(res);
        }
      })
      .catch(() => {
        setError("No se pudo cargar el artículo");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (!article) return null;

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <ArticleCard article={article} />
    </div>
  );
}
