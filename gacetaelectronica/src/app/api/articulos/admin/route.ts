// // src/app/api/articulos/admin/route.ts
//Prueba malita jijij
// import { NextResponse } from "next/server";
// //import { getArticleByIdPreview } from "@/services/article.service"; // Asegúrate de tener esta función ya hecha
// //import { getArticlePreviewById } from "../../../src/app/publica/articulo/[id]/services/article.service"; // asegúrate de que la ruta sea correcta
// //import { getArticlePreviewById } from "../../../../app/publica/articulo/[id]/services/article.service";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
//   }

//   try {
//     const article = await getArticlePreviewById(Number(id));
//     if (!article) {
//       return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
//     }
//     return NextResponse.json(article);
//   } catch (error) {
//     console.error("Error al obtener artículo:", error);
//     return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
//   }
// }
