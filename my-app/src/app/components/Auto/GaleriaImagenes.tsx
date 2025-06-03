'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Auto } from '@/types/auto';

interface OptimizedGalleryImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  onLoad: () => void;
}

const OptimizedGalleryImage = ({ src, alt, isActive, onLoad }: OptimizedGalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      {isLoading && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-[20px] z-20">
          <div className="w-12 h-12 border-4 border-[#11295B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        quality={isActive ? 90 : 60}
        priority={isActive}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
        style={{ 
          objectFit: 'cover',
          transition: 'transform 0.3s ease-out' 
        }}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
        className={`rounded-[20px] ${isActive ? 'scale-100' : 'scale-105'}`}
        onLoadingComplete={() => {
          setIsLoading(false);
          onLoad();
        }}
      />
    </div>
  );
};

export default function GaleriaImagenes({ imagenes, marca, modelo }: Pick<Auto, 'imagenes' | 'marca' | 'modelo'>) {
  const [imagenActual, setImagenActual] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  
  useEffect(() => {
    if (!imagenes || imagenes.length === 0) return;
    
    const imagesToPreload = [
      imagenes[imagenActual].direccionImagen, 
      imagenes[(imagenActual + 1) % imagenes.length].direccionImagen
    ];
    
    setPreloadedImages(prev => [...new Set([...prev, ...imagesToPreload])]);
  }, [imagenes, imagenActual]);

  const siguienteImagen = () => {
    if (isTransitioning || !imagenes || imagenes.length <= 1) return;
    
    setIsTransitioning(true);
    setImagenActual((prev) => (prev < (imagenes?.length ?? 0) - 1 ? prev + 1 : 0));
    
    if (imagenes.length > 2) {
      const nextIndex = (imagenActual + 2) % imagenes.length;
      setPreloadedImages(prev => [...new Set([...prev, imagenes[nextIndex].direccionImagen])]);
    }
  };

  const imagenAnterior = () => {
    if (isTransitioning || !imagenes || imagenes.length <= 1) return;
    
    setIsTransitioning(true);
    setImagenActual((prev) => (prev > 0 ? prev - 1 : (imagenes?.length ?? 1) - 1));
    
    if (imagenes.length > 2) {
      const prevIndex = imagenActual === 0 ? imagenes.length - 2 : (imagenActual - 2 + imagenes.length) % imagenes.length;
      setPreloadedImages(prev => [...new Set([...prev, imagenes[prevIndex].direccionImagen])]);
    }
  };

  const handleImageLoad = () => {
    setIsTransitioning(false);
  };

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="relative mx-auto w-[100%] sm:w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border border-black rounded-[20px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No hay imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[100%] sm:w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border border-black rounded-[20px] overflow-hidden">
      {/* Botón izquierda */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50 transition-colors"
        onClick={imagenAnterior}
        disabled={isTransitioning || imagenes.length <= 1}
        aria-label="Imagen anterior"
      >
        {'<'}
      </button>

      {/* Contenedor de imágenes */}
      <div className="relative w-full h-full">
        {imagenes.map((imagen, index) => (
          <OptimizedGalleryImage
            key={imagen.idImagen}
            src={imagen.direccionImagen}
            alt={`Imagen ${index + 1} del auto ${marca} ${modelo}`}
            isActive={index === imagenActual}
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      {/* Botón derecha */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50 transition-colors"
        onClick={siguienteImagen}
        disabled={isTransitioning || imagenes.length <= 1}
        aria-label="Imagen siguiente"
      >
        {'>'}
      </button>

      {imagenes.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
          {imagenes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === imagenActual ? 'bg-[#11295B] w-4' : 'bg-white/70'
              }`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setImagenActual(index);
                }
              }}
              aria-label={`Ver imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <div className="hidden">
        {preloadedImages.map((src, idx) => (
          <Image 
            key={`preload-${idx}`}
            src={src} 
            alt="Precarga" 
            width={1} 
            height={1} 
            loading="eager"
            priority={false}
          />
        ))}
      </div>
    </div>
  );
}