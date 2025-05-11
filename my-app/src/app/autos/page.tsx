"use client"

import { useEffect, useState } from "react"
import { getAutos, getAutosDisponiblesPorFecha } from "@/libs/api"
import type { Auto } from "@/types/auto"
import Image from "next/image"
import BarraBusqueda from "@/components/Auto/BusquedaAuto/BarraBusqueda"
import Link from "next/link"
import Estrellas from "@/components/Auto/Estrellas"
import OrdenadoPor from "@/components/Auto/Ordenamiento/OrdenadoPor"
import BarraReserva from "@/components/listaAutos/barraReserva"

export default function AutosPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([])
  const [busquedaActiva, setBusquedaActiva] = useState<boolean>(false)
  const [fechasReserva, setFechasReserva] = useState<{ inicio: string; fin: string } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getAutos()
        setAutos(data)
        setAutosFiltrados(data)
      } catch (err) {
        console.error("Error al cargar autos:", err)
        setError("Error al cargar los autos. Por favor, recarga la página.")
      }
    }
    fetchData()
  }, [])

  const filtrarAutos = (busqueda: string) => {
    // Si hay una búsqueda por fechas activa, filtramos sobre los autos ya filtrados por disponibilidad
    const autosBase = busquedaActiva ? autosFiltrados : autos

    if (!busqueda.trim()) {
      setAutosFiltrados(autosBase)
      return
    }

    const valor = busqueda.toLowerCase().trim()
    const palabras = valor.split(/[\s-]+/)

    if (palabras.length === 2) {
      const [marca, modelo] = palabras
      const filtrados = autosBase.filter(
        (auto) => auto.marca.toLowerCase().includes(marca) && auto.modelo.toLowerCase().includes(modelo),
      )
      setAutosFiltrados(ordenarResultados(filtrados))
      return
    }

    const filtrados = autosBase.filter((auto) => {
      const marcaMatch = auto.marca.toLowerCase().includes(valor)
      const modeloMatch = auto.modelo.toLowerCase().includes(valor)
      return marcaMatch || modeloMatch
    })

    setAutosFiltrados(ordenarResultados(filtrados, valor))
  }

  const ordenarResultados = (autos: Auto[], termino = "") => {
    return [...autos].sort((a, b) => {
      const aMarcaStarts = a.marca.toLowerCase().startsWith(termino)
      const bMarcaStarts = b.marca.toLowerCase().startsWith(termino)

      if (aMarcaStarts && !bMarcaStarts) return -1
      if (!aMarcaStarts && bMarcaStarts) return 1

      const marcaCompare = a.marca.localeCompare(b.marca)
      if (marcaCompare !== 0) return marcaCompare

      return a.modelo.localeCompare(b.modelo)
    })
  }

  const aplicarOrden = (opcion: string) => {
    const autosOrdenados = [...autosFiltrados]

    switch (opcion) {
      case "Mejor calificación":
        autosOrdenados.sort((a, b) => (b.calificacionPromedio ?? 0) - (a.calificacionPromedio ?? 0))
        break
      case "Modelo: a - z":
        autosOrdenados.sort((a, b) => a.modelo.localeCompare(b.modelo))
        break
      case "Modelo: z - a":
        autosOrdenados.sort((a, b) => b.modelo.localeCompare(a.modelo))
        break
      case "Marca: a - z":
        autosOrdenados.sort((a, b) => a.marca.localeCompare(b.marca))
        break
      case "Marca: z - a":
        autosOrdenados.sort((a, b) => b.marca.localeCompare(a.marca))
        break
      case "Precio: mayor a menor":
        autosOrdenados.sort((a, b) => Number(b.precioRentaDiario) - Number(a.precioRentaDiario))
        break
      case "Precio: menor a mayor":
        autosOrdenados.sort((a, b) => Number(a.precioRentaDiario) - Number(b.precioRentaDiario))
        break
      default:
        break
    }

    setAutosFiltrados(autosOrdenados)
  }

  const buscarAutosDisponibles = async (fechaInicio: string, fechaFin: string) => {
    try {
      setCargando(true)
      setError(null)

      // Formatear las fechas para asegurarnos de que estén en el formato correcto
      const inicio = new Date(fechaInicio).toISOString().split("T")[0]
      const fin = new Date(fechaFin).toISOString().split("T")[0]

      console.log(`Buscando autos disponibles entre ${inicio} y ${fin}`)

      // Guardar las fechas para referencia
      setFechasReserva({ inicio: fechaInicio, fin: fechaFin })

      // Llamar a la API para obtener autos disponibles
      const { data } = await getAutosDisponiblesPorFecha(inicio, fin)

      // Actualizar el estado
      setAutosFiltrados(data)
      setBusquedaActiva(true)
    } catch (error) {
      console.error("Error al buscar autos disponibles:", error)
      setError("Hubo un error al buscar autos disponibles. Por favor intente nuevamente.")
      // En caso de error, mantener la lista actual
    } finally {
      setCargando(false)
    }
  }

  // Función para limpiar la búsqueda por disponibilidad
  const limpiarBusquedaDisponibilidad = () => {
    setBusquedaActiva(false)
    setFechasReserva(null)
    setAutosFiltrados(autos)
    setError(null)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Barra de reserva */}
        <div className="mb-4">
          <BarraReserva onBuscarDisponibilidad={buscarAutosDisponibles} />
        </div>

        {/* Indicador de error */}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {/* Indicador de carga */}
        {cargando && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
            <p className="text-blue-700">Buscando autos disponibles...</p>
          </div>
        )}

        {/* Indicador de búsqueda activa y botón para limpiar */}
        {busquedaActiva && fechasReserva && !cargando && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-blue-800 font-medium">
                Mostrando autos disponibles desde {new Date(fechasReserva.inicio).toLocaleDateString()} hasta{" "}
                {new Date(fechasReserva.fin).toLocaleDateString()}
              </p>
            </div>
            <button onClick={limpiarBusquedaDisponibilidad} className="text-blue-600 hover:text-blue-800 font-medium">
              Limpiar filtro
            </button>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="mb-4">
          <BarraBusqueda onBuscar={filtrarAutos} totalResultados={autosFiltrados.length} />
        </div>

        {/* Componente OrdenadoPor */}
        <div className="mb-6">
          <OrdenadoPor onOrdenar={aplicarOrden} />
        </div>
        {/* Lista de autos */}
        {autosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {autosFiltrados.map((auto: Auto) => (
              <div
                key={auto.idAuto}
                className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Contenedor de imagen y estrellas */}
                  <div className="flex flex-col w-full md:w-[350px] flex-shrink-0">
                    {/* Solo la imagen */}
                    <div className="relative w-full h-[250px] bg-[#d9d9d9] rounded-lg flex items-center justify-center">
                      {auto.imagenes?.[0]?.direccionImagen ? (
                        <Image
                          src={auto.imagenes[0].direccionImagen || "/placeholder.svg"}
                          alt="Imagen del auto"
                          style={{ objectFit: "cover" }}
                          className="rounded-lg"
                          fill
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Promedio y estrellas - Debajo de la imagen */}
                    <div className="flex items-center justify-center mt-8">
                      <div className="flex items-center gap-8">
                        <span className="bg-[#11295B] text-white text-base font-bold px-3 py-1 rounded-md min-w-[48px] text-center">
                          {(auto.calificacionPromedio ?? 0).toFixed(1)}
                        </span>
                        <div className="scale-150">
                          <Estrellas promedio={auto.calificacionPromedio ?? 0} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles + Precio y Botón */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="bg-white p-5 w-full h-full flex flex-col justify-between">
                      <h2 className="text-[#11295B] text-xl font-bold mb-4">
                        {auto.marca} - {auto.modelo}
                      </h2>

                      {/* Características */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-4 lg:gap-x-30 mb-4">
                        {/* Columna 1 */}
                        <div className="flex flex-col gap-5">
                          {[
                            {
                              icon: "/imagenesIconos/usuario.png",
                              label: "Capacidad",
                              value: `${auto.asientos} personas`,
                            },
                            {
                              icon: "/imagenesIconos/cajaDeCambios.png",
                              label: "Transmisión",
                              value: auto.transmision,
                            },
                            {
                              icon: "/imagenesIconos/maleta.png",
                              label: "Maletero",
                              value: `${auto.capacidadMaletero} equipaje/s`,
                            },
                          ].map(({ icon, label, value }, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <Image
                                src={icon || "/placeholder.svg"}
                                alt={label}
                                width={50}
                                height={50}
                                className="w-[50px] h-[50px]"
                                unoptimized
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[16px] text-black whitespace-nowrap">
                                  {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                                </span>
                                <span className="text-[14px] text-[#292929]">{label}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Columna 2 */}
                        <div className="flex flex-col gap-5">
                          {[
                            {
                              icon: "/imagenesIconos/velocimetro.png",
                              label: "Kilometraje",
                              value: `${auto.kilometraje} km`,
                            },
                            {
                              icon: "/imagenesIconos/gasolinera.png",
                              label: "Combustible",
                              value: auto.combustible,
                            },
                          ].map(({ icon, label, value }, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <Image
                                src={icon || "/placeholder.svg"}
                                alt={label}
                                width={50}
                                height={50}
                                className="w-[50px] h-[50px]"
                                unoptimized
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[16px] text-black whitespace-nowrap">
                                  {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                                </span>
                                <span className="text-[14px] text-[#292929]">{label}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Columna 3 - Solo visible en pantallas grandes - Ahora vacía */}
                        <div className="hidden lg:block"></div>
                      </div>

                      {/* Precio y botón */}
                      <div className="flex flex-row justify-between items-center mt-2 sm:mt-4">
                        <div className="text-left">
                          <p className="text-sm text-gray-600">Precio por día</p>
                          <p className="text-lg font-semibold text-[#11295B]">{auto.precioRentaDiario} BOB</p>
                        </div>

                        <Link
                          className="inline-block px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]"
                          href={`/detalleCoche/${auto.idAuto}`}
                          target="_blank"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            {cargando ? "Cargando autos..." : "No se encontraron resultados"}
          </p>
        )}
      </div>
    </>
  )
}
