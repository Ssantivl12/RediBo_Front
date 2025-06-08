"use client"

import { useEffect, useState } from "react"
import { getAutosDisponiblesPorFecha } from "@/libs/autoServices"
import type { Auto, Comentario } from "@/types/auto"
import Image from "next/image"
import BarraBusqueda from "@/app/components/Auto/BusquedaAuto/BarraBusqueda"
import Link from "next/link"
import Estrellas from "@/app/components/Auto/Estrellas"
import OrdenadoPor from "@/app/components/Auto/Ordenamiento/OrdenadoPor"
import BarraReserva from "@/app/components/listaAutos/barraReserva"

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

const OptimizedImage = ({ 
  src, 
  alt,
  priority = false,
  className = "",
  sizes = "100vw"
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  //imagen de fallback
  const fallbackImage = "/imagenesIconos/default.png"
  
  // Validar src y usar fallback si está vacío
  const validSrc = src && src.trim() !== "" ? src : fallbackImage
  const [imgSrc, setImgSrc] = useState(validSrc)
  
  const handleError = () => {
    if (!hasError && imgSrc !== fallbackImage) {
      console.log(`Error cargando imagen: ${src}, usando fallback`)
      setHasError(true)
      setImgSrc(fallbackImage)
    }
  }
  
  const handleLoadComplete = () => {
    setIsLoading(false)
  }
  
  // resetear error cuando src cambia
  useEffect(() => {
    const newValidSrc = src && src.trim() !== "" ? src : fallbackImage
    if (newValidSrc !== imgSrc) {
      setImgSrc(newValidSrc)
      setHasError(newValidSrc === fallbackImage)
    }
  }, [src, imgSrc, fallbackImage])
  // No renderizar si no hay src válida
  if (!imgSrc || imgSrc.trim() === "") {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-gray-500 text-sm">Sin imagen</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-lg">
          <span className="sr-only">Cargando...</span>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        quality={85}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
        className={`rounded-lg object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${
          imgSrc === fallbackImage ? 'scale-75' : ''
        } ${className}`}
        onLoadingComplete={handleLoadComplete}
        onError={handleError}
      />
      {/*Indicador opcional pa saber que es img de fallback*/}
      {hasError && (
        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-20">
          Imagen no disponible
        </div>
      )}
    </div>
  )
}

export default function AutosPage() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([])
  const [busquedaActiva, setBusquedaActiva] = useState<boolean>(false)
  const [fechasReserva, setFechasReserva] = useState<{ inicio: string; fin: string } | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const [promediosPorAuto, setPromediosPorAuto] = useState<{ [key: number]: number }>({})
  
  const [imagesToLoad, setImagesToLoad] = useState(8)

  useEffect(() => {
    if (!autosFiltrados.length) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0]
        if (lastEntry.isIntersecting && autosFiltrados.length > imagesToLoad) {
          setImagesToLoad(prev => prev + 4)
        }
      },
      { threshold: 0.1 }
    )
    
    const lastCardElement = document.getElementById('last-visible-card')
    if (lastCardElement) {
      observer.observe(lastCardElement)
    }
    
    return () => {
      if (lastCardElement) observer.unobserve(lastCardElement)
    }
  }, [autosFiltrados, imagesToLoad])

  const calcularPromedio = (comentarios: Comentario[]): number => {
    const comentariosValidos = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '');
    return comentariosValidos.length > 0
      ? comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) / comentariosValidos.length
      : 0;
  }

  // Función para ordenar por mejor calificación
  const ordenarPorMejorCalificacion = (autosData: Auto[]): Auto[] => {
    return [...autosData].sort((a, b) => {
      const promedioA = promediosPorAuto[a.idAuto] ?? (a.calificacionPromedio ?? 0);
      const promedioB = promediosPorAuto[b.idAuto] ?? (b.calificacionPromedio ?? 0);
      return promedioB - promedioA;
    });
  }

  const cargarComentariosAutos = async (autosData: Auto[]) => {
    try {
      const { getComentariosDeAuto } = await import('@/libs/autoServices');
      
      const comentariosPromises = autosData.map(async (auto) => {
        try {
          const response = await getComentariosDeAuto(auto.idAuto);
          return { idAuto: auto.idAuto, comentarios: response.data };
        } catch (error) {
          console.error(`Error al obtener comentarios para auto ${auto.idAuto}:`, error);
          return { idAuto: auto.idAuto, comentarios: [] };
        }
      });

      const resultados = await Promise.all(comentariosPromises);
      
      const nuevosComentarios: { [key: number]: Comentario[] } = {};
      const nuevosPromedios: { [key: number]: number } = {};

      resultados.forEach(({ idAuto, comentarios }) => {
        nuevosComentarios[idAuto] = comentarios;
        nuevosPromedios[idAuto] = calcularPromedio(comentarios);
      });

      setPromediosPorAuto(nuevosPromedios);
      
      // Aplicar ordenamiento por mejor calificación después de cargar comentarios
      return nuevosPromedios;
    } catch (error) {
      console.error('Error al cargar comentarios de autos:', error);
      return {};
    }
  }

  const buscarAutosDisponibles = async (fechaInicio: string, fechaFin: string) => {
    try {
      const inicio = new Date(fechaInicio).toISOString().split("T")[0]
      const fin = new Date(fechaFin).toISOString().split("T")[0]

      console.log(`Buscando autos disponibles entre ${inicio} y ${fin}`)

      setFechasReserva({ inicio: fechaInicio, fin: fechaFin })
      setCargando(true)

      const { data } = await getAutosDisponiblesPorFecha(inicio, fin)

      setAutos(data)
      setBusquedaActiva(true)
      setImagesToLoad(8)
      
      // Cargar comentarios y luego ordenar por mejor calificación
      const nuevosPromedios = await cargarComentariosAutos(data)
      
      // Ordenar por mejor calificación usando los promedios recién cargados
      const autosOrdenados = [...data].sort((a, b) => {
        const promedioA = nuevosPromedios[a.idAuto] ?? (a.calificacionPromedio ?? 0);
        const promedioB = nuevosPromedios[b.idAuto] ?? (b.calificacionPromedio ?? 0);
        return promedioB - promedioA;
      });
      
      setAutosFiltrados(autosOrdenados)
    } catch (error) {
      console.error("Error al buscar autos disponibles:", error)
      setError("Hubo un error al buscar autos disponibles. Por favor intente nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  const filtrarAutos = (busqueda: string) => {
    const autosBase = autos

    if (!busqueda.trim()) {
      // Al limpiar la búsqueda, ordenar por mejor calificación
      const autosOrdenados = ordenarPorMejorCalificacion(autosBase)
      setAutosFiltrados(autosOrdenados)
      return
    }

    const valor = busqueda.toLowerCase().trim()
    const palabras = valor.split(/[\s-]+/)

    if (palabras.length === 2) {
      const [marca, modelo] = palabras
      const filtrados = autosBase.filter(
        (auto) => auto.marca.toLowerCase().includes(marca) && auto.modelo.toLowerCase().includes(modelo),
      )
      // Mantener ordenamiento por calificación en resultados filtrados
      const filtradosOrdenados = ordenarPorMejorCalificacion(ordenarResultados(filtrados))
      setAutosFiltrados(filtradosOrdenados)
      return
    }

    const filtrados = autosBase.filter((auto) => {
      const marcaMatch = auto.marca.toLowerCase().includes(valor)
      const modeloMatch = auto.modelo.toLowerCase().includes(valor)
      return marcaMatch || modeloMatch
    })

    // Mantener ordenamiento por calificación en resultados filtrados
    const filtradosOrdenados = ordenarPorMejorCalificacion(ordenarResultados(filtrados, valor))
    setAutosFiltrados(filtradosOrdenados)
    setImagesToLoad(8)
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
        autosOrdenados.sort((a, b) => {
          // Usar el promedio calculado localmente, con fallback al del backend
          const promedioA = promediosPorAuto[a.idAuto] ?? (a.calificacionPromedio ?? 0);
          const promedioB = promediosPorAuto[b.idAuto] ?? (b.calificacionPromedio ?? 0);
          return promedioB - promedioA;
        })
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

  const obtenerPromedioCalculado = (auto: Auto): number => {
    return promediosPorAuto[auto.idAuto] ?? (auto.calificacionPromedio ?? 0);
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Barra de reserva */}
        <div className="mb-4">
          <BarraReserva onBuscarDisponibilidad={buscarAutosDisponibles} />
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        {/* Indicador de carga */}
        {cargando && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
            <p className="text-blue-700">Buscando autos disponibles...</p>
          </div>
        )}

        {/* Indicador de búsqueda activa*/}
        {fechasReserva && !cargando && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-blue-800 font-medium">
                Mostrando autos disponibles desde {new Date(fechasReserva.inicio).toLocaleDateString()} hasta{" "}
                {new Date(fechasReserva.fin).toLocaleDateString()} - Ordenados por mejor calificación
              </p>
            </div>
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
            {autosFiltrados.slice(0, imagesToLoad).map((auto: Auto, index: number) => {
              const promedioCalculado = obtenerPromedioCalculado(auto);
              
              return (
                <div
                  key={auto.idAuto}
                  id={index === imagesToLoad - 1 ? 'last-visible-card' : undefined}
                  className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Contenedor de imagen y estrellas */}
                    <div className="flex flex-col w-full md:w-[350px] flex-shrink-0">
                      {/* Solo la imagen */}
                      <div className="relative w-full h-[250px] bg-[#f1f1f1] rounded-lg">
                        <OptimizedImage
                          src={auto.imagenes?.[0]?.direccionImagen || ""}
                          alt={`${auto.marca} ${auto.modelo}`}
                          priority={index < 2} // Priorizar solo las primeras imágenes
                          sizes="(max-width: 768px) 100vw, 350px"
                        />
                      </div>

                      {/* Promedio y estrellas - Debajo de la imagen */}
                      <div className="flex items-center justify-center mt-8">
                        <div className="flex items-center gap-8">
                          <span className="bg-[#11295B] text-white text-base font-bold px-3 py-1 rounded-md min-w-[48px] text-center">
                            {promedioCalculado.toFixed(1)}
                          </span>
                          <div className="scale-150">
                            <Estrellas promedio={promedioCalculado} />
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

                        {/* Características - Versión móvil (2 columnas) */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 sm:hidden">
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
                            <div key={index} className="flex items-center gap-2">
                              <Image
                                src={icon || "/placeholder.svg"}
                                alt={label}
                                width={30}
                                height={30}
                                className="w-[30px] h-[30px]"
                                loading="lazy"
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[14px] text-black whitespace-nowrap">
                                  {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                                </span>
                                <span className="text-[12px] text-[#292929]">{label}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Características - Versión original para tablets y desktop */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-y-6 sm:gap-x-4 lg:gap-x-30 mb-4">
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
                                  loading="lazy"
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
                                  loading="lazy"
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
              )
            })}
            
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            {busquedaActiva ? 
            (cargando ? "Cargando autos..." : "No se encontraron resultados") : "Ingrese las fechas que desea rentar"}
          </p>
        )}
      </div>
    </>
  )
}