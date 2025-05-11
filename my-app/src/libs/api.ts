import type { Auto, Comentario } from "@/types/auto"

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
    // Formatear las fechas en el formato YYYY-MM-DD
    const inicio = fechaInicio.split("T")[0] // Extraer solo la parte de la fecha YYYY-MM-DD
    const fin = fechaFin.split("T")[0] // Extraer solo la parte de la fecha YYYY-MM-DD

    console.log(`Consultando autos disponibles entre ${inicio} y ${fin}`)

    // ruta definida para el backend, talvez me equivoque aqui
    const res = await fetch(`${BASE_URL}/autosDisponibles/${inicio}/${fin}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Error de API: Status ${res.status} - ${res.statusText}`)

      // Intentar obtener detalles del error si es posible
      let errorMessage = `${res.status} ${res.statusText}`
      try {
        const errorData = await res.json()
        console.error("Detalles del error:", errorData)
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // Si no podemos parsear el JSON, simplemente continuamos con el mensaje de error básico
      }

      throw new Error(`Error al obtener autos disponibles: ${errorMessage}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error en getAutosDisponiblesPorFecha:", error)
    throw error // Simplemente reenviar el error original para evitar mensajes duplicados
  }
}
