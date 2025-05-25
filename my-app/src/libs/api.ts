import type { Auto, Comentario } from "@/types/auto"
import type { Usuario } from "@/types/auto"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export async function getAutos(): Promise<{ data: Auto[] }> {
  const res = await fetch(`${BASE_URL}/autos`, { cache: "no-store" })
  if (!res.ok) throw new Error("Error al obtener autos")
  return res.json()
}

export async function getAutoPorId(id: string): Promise<{ data: Auto }> {
  const res = await fetch(`${BASE_URL}/autos/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Auto no encontrado")
  return res.json()
}

export async function getComentariosDeAuto(autoId: number): Promise<{ data: Comentario[] }> {
  const res = await fetch(`${BASE_URL}/autos/${autoId}/comentarios`, { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudieron cargar los comentarios")
  return res.json()
}

export async function getAutosDisponiblesPorFecha(fechaInicio: string, fechaFin: string): Promise<{ data: Auto[] }> {
  try {
    const inicio = fechaInicio.split("T")[0]
    const fin = fechaFin.split("T")[0]

    console.log(`Consultando autos disponibles entre ${inicio} y ${fin}`)

    const res = await fetch(`${BASE_URL}/autosDisponibles/${inicio}/${fin}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Error de API: Status ${res.status} - ${res.statusText}`)
      let errorMessage = `${res.status} ${res.statusText}`
      
      try {
        const errorData = await res.json()
        console.error("Detalles del error:", errorData)
        if (errorData.message) errorMessage = errorData.message
      } catch (error) {
        console.log("No se pudo parsear la respuesta de error:", error)
      }

      throw new Error(`Error al obtener autos disponibles: ${errorMessage}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error en getAutosDisponiblesPorFecha:", error)
    throw error
  }
}

export async function getUsuarios(): Promise<{ data: Usuario[] }> {
  const res = await fetch(`${BASE_URL}/usuarios`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function getComentariosDeHost(id: number): Promise<{ data: Comentario[] }> {
  console.log("BASE_URL:", BASE_URL);

  try {
    const res = await fetch(`${BASE_URL}/host/${id}/comentarios`, { cache: "no-store" });

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error(`Error al obtener comentarios del host. Status: ${res.status}, Detalles: ${errorDetails}`);
      throw new Error(`Error al obtener comentarios del host: ${res.statusText}`);
    }

    const responseData = await res.json();
    
    if (Array.isArray(responseData)) {
      return { data: responseData };
    }
    
    if (responseData.data) {
      return responseData;
    }

    throw new Error("Formato de respuesta inesperado de la API");
    
  } catch (error) {
    console.error("Error inesperado en getComentariosDeHost:", error);
    throw new Error("No se pudieron cargar los comentarios del host.");
  }
}