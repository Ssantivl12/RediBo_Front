import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Estrellas from "@/app/components/Auto/Estrellas";

interface Imagen {
  idImagen: number;
  direccionImagen: string;
}

interface Comentario {
  idComentario: number;
  idCalificador: number;
  nombreCompleto: string;
  contenido: string;
  comentario: string;
  calificacion: number;
  puntuacion: number;
  fechaCreacion: string;
  usuario: {
    nombreCompleto: string;
  };
}

interface AutoConDisponibilidad {
  idAuto: number;
  modelo: string;
  marca: string;
  precio: string;
  comentarios?: Comentario[];
  disponible: boolean;
  imagenes?: Imagen[];
}

interface Props {
  autos: AutoConDisponibilidad[];
}

const OptimizedImage = ({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "100vw"
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "/imagenesIconos/default.png"; 
  const validSrc = src && src.trim() !== "" ? src : fallbackImage;
  const [imgSrc, setImgSrc] = useState(validSrc);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackImage) {
      setHasError(true);
      setImgSrc(fallbackImage);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const newValidSrc = src && src.trim() !== "" ? src : fallbackImage;
    if (newValidSrc !== imgSrc) {
      setImgSrc(newValidSrc);
      setHasError(newValidSrc === fallbackImage);
      setIsLoading(true);
    }
  }, [src]);

  return (
    <div className="relative w-full h-48 bg-gray-100 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
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
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
      {hasError && (
        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-20">
          Imagen no disponible
        </div>
      )}
    </div>
  );
};

export default function AutosDelHost({ autos }: Props) {
  const [links, setLinks] = useState<{ [key: number]: string }>({});
  const [comentariosPorAuto, setComentariosPorAuto] = useState<{[key: number]: Comentario[]}>({});
  const [cargandoComentarios, setCargandoComentarios] = useState(true);

  const calcularPromedio = (comentarios: Comentario[] = []): number => {
    const comentariosValidos = comentarios.filter(c => c.calificacion > 0);
    if (comentariosValidos.length === 0) return 0;
    
    const suma = comentariosValidos.reduce((total, comentario) => {
      return total + comentario.calificacion;
    }, 0);
    
    return parseFloat((suma / comentariosValidos.length).toFixed(1));
  };

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const { getComentariosDeAuto } = await import('@/libs/autoServices');
        const comentariosData = await Promise.all(
          autos.map(async auto => {
            const { data } = await getComentariosDeAuto(auto.idAuto);
            return { idAuto: auto.idAuto, comentarios: data };
          })
        );
        
        const comentariosMap = comentariosData.reduce((acc, curr) => {
          acc[curr.idAuto] = curr.comentarios;
          return acc;
        }, {} as {[key: number]: Comentario[]});
        
        setComentariosPorAuto(comentariosMap);
      } catch (error) {
        console.error("Error obteniendo comentarios:", error);
      } finally {
        setCargandoComentarios(false);
      }
    };

    if (autos.length > 0) {
      fetchComentarios();
    } else {
      setCargandoComentarios(false);
    }
  }, [autos]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reservaData = localStorage.getItem("reservaData");
      const nuevosLinks: { [key: number]: string } = {};

      autos.forEach((auto) => {
        let linkDetalle = `/detalleCoche/${auto.idAuto}`;
        if (reservaData) {
          try {
            const { pickupDate, pickupTime, returnDate, returnTime } = JSON.parse(reservaData);
            if (pickupDate && pickupTime && returnDate && returnTime) {
              const inicioISO = new Date(pickupDate).toISOString();
              const finISO = new Date(returnDate).toISOString();
              linkDetalle += `?inicio=${encodeURIComponent(inicioISO)}&fin=${encodeURIComponent(finISO)}`;
            }
          } catch (error) {
            console.warn("Error al parsear reservaData:", error);
          }
        }
        nuevosLinks[auto.idAuto] = linkDetalle;
      });

      setLinks(nuevosLinks);
    }
  }, [autos]);

  if (autos.length === 0) {
    return <p className="text-gray-500">El host no tiene autos disponibles.</p>;
  }

  if (cargandoComentarios) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {autos.map((auto) => (
          <div key={auto.idAuto} className="bg-white shadow-md p-4 rounded-lg flex flex-col">
            <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mt-4 animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded mt-4 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {autos.map((auto, index) => {
        const comentarios = comentariosPorAuto[auto.idAuto] || [];
        const promedio = calcularPromedio(comentarios);
        
        let imageSrc = "";
        if (auto.imagenes && auto.imagenes.length > 0) {
          const primeraImagen = auto.imagenes[0].direccionImagen;
          imageSrc = primeraImagen.startsWith('http') || primeraImagen.startsWith('/') 
            ? primeraImagen 
            : `/imagenesAutos/${auto.marca}/${primeraImagen}`;
        }

        return (
          <div
            key={auto.idAuto}
            className="bg-white shadow-md p-4 rounded-lg flex flex-col"
          >
            <div className="w-full h-48 bg-gray-100 rounded-lg relative">
              <OptimizedImage
                src={imageSrc}
                alt={`${auto.marca} ${auto.modelo}`}
                priority={index < 2}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            <h3 className="text-base font-bold text-[#11295b] mt-4">
              {auto.modelo} - {auto.marca}
            </h3>

            <div className="text-sm text-[#292929] font-semibold mt-1 flex items-center gap-2">
              <span>{promedio.toFixed(1)}</span>
              <Estrellas promedio={promedio} />
              <span className="text-xs text-gray-400">
                ({comentarios.length} {comentarios.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[13px] text-gray-500">Precio por día</p>
                <p className="text-lg font-bold text-[#11295b]">{auto.precio} BOB</p>
              </div>

              <Link
                href={links[auto.idAuto] || `/detalleCoche/${auto.idAuto}`}
                className="bg-[#fca311] hover:bg-[#e4920b] text-white px-4 py-2 rounded text-sm font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}