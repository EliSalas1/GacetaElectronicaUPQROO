import { NextRequest } from "next/server";
import { getArticulos } from "./articuloServices";

export async function GET(req: NextRequest) {
    try {
        const search =
            req.nextUrl.searchParams.get("q") ||
            req.nextUrl.searchParams.get("search") ||
            undefined;

        const categoria = req.nextUrl.searchParams.get("categoria") || undefined;
        const autor = req.nextUrl.searchParams.get("autor") || undefined;
        const estado = req.nextUrl.searchParams.get("estado") || undefined;

        const articulos = await getArticulos({ search, categoria, autor, estado });

        return new Response(JSON.stringify(articulos), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error al buscar artículos:", error);
        return new Response(
            JSON.stringify({ error: "Error al buscar artículos" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}