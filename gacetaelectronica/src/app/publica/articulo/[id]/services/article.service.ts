// src/services/article.service.ts


// 2. Obtener un artículo por ID (GET)
export async function getArticleById(id: number) {
  const res = await fetch(`/api/articulos?id=${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

  // 3. Crear artículo (POST)
  export async function createArticle(data: {
    Titulo: string;
    Resumen: string;
    Contenido: string;
    IdCategoria: number;
  }) {
    const res = await fetch('/api/articulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  // 4. Actualizar artículo (PUT)
  export async function updateArticle(id: number, data: any) {
    const res = await fetch(`/api/articulos?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  // 5. Eliminar artículo (DELETE)
  export async function deleteArticle(id: number) {
    const res = await fetch(`/api/articulos?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }