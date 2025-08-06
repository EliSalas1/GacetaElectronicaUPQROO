"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Loader2 } from "lucide-react";
import ArticleEditor from "@/components/redactor/ArticleEditor";
import MyArticles from "@/components/redactor/MyArticles";
import PrivateHeader from "@/components/PrivateHeader";
import { useSessionUser } from "@/hooks/useSessionUser";

interface ArticleStats {
  published: number;
  pending: number;
}

interface ArticleData {
  IdArticulo: number;
  Titulo: string;
  Resumen: string;
  Contenido: string;
  IdCategoria: number;
  Categoria?: {
    IdCategoria: number;
    Nombre: string;
  };
}

export default function Page() {
  const router = useRouter();
  const { userInfo, loading: userLoading, status } = useSessionUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<ArticleStats>({ published: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);

  useEffect(() => {
    if (!userLoading && status === "unauthenticated") {
      router.push("/publica/login");
    }

    if (!userLoading && userInfo?.role !== "Autor") {
      router.push("/forbidden");
    }
  }, [router, userLoading, userInfo?.role, status]);

const loadArticleStats = useCallback(async () => {
  if (!userInfo?.id) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(`/api/articuloUsuario?usuarioId=${userInfo.id}`);
    if (!response.ok) throw new Error("Error al cargar estadísticas");

    const userArticles = await response.json();

    const articlesWithDetails = await Promise.all(
      userArticles.map(async (article: any) => {
        try {
          const articleResponse = await fetch(`/api/articulos?id=${article.idArticulo}`);
          return articleResponse.ok ? await articleResponse.json() : null;
        } catch (error) {
          console.error("Error al obtener detalles del artículo:", error);
          return null;
        }
      })
    );

    const validArticles = articlesWithDetails.filter((a) => a !== null);
    const published = validArticles.filter((a: any) => a.status === 'published').length;
    const pending = validArticles.filter((a: any) => a.status === 'pending').length;

    setStats({ published, pending });
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
  } finally {
    setLoading(false);
  }
}, [userInfo?.id]);


  const handleEditArticle = (article: ArticleData) => {
    setArticleData(article);
    setEditMode(true);
    setActiveTab("new-article");
  };


  const handleArticleUpdated = () => {
    setEditMode(false);
    setArticleData(null);
    setActiveTab("my-articles");
    loadArticleStats();
  };

  useEffect(() => {
    if (!userLoading && userInfo?.id) loadArticleStats();

    const stored = localStorage.getItem("editArticleData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setArticleData(parsed);
        setEditMode(true);
        setActiveTab("new-article");
        localStorage.removeItem("editArticleData");
      } catch (err) {
        console.error("Error al parsear datos de edición:", err);
        localStorage.removeItem("editArticleData");
      }
    }
}, [userInfo?.id, userLoading, loadArticleStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Redacción</h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus artículos para la gaceta electrónica
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="new-article">
              {editMode ? "Editar Artículo" : "Nuevo Artículo"}
            </TabsTrigger>
            <TabsTrigger value="my-articles">Mis Artículos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading || userLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 justify-center">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Artículos Publicados</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.published}</div>
                    <p className="text-xs text-muted-foreground">En total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">Pendientes de aprobación</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new-article">
            <ArticleEditor
              editMode={editMode}
              articleData={articleData || undefined}
              onArticleUpdated={handleArticleUpdated}
            />
          </TabsContent>

          <TabsContent value="my-articles">
            <MyArticles onEditArticle={handleEditArticle} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
