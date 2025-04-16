'use client';

import { useState, useEffect, useMemo, useRef} from 'react';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import UsuarioIcon from './imagenesIconos/usuario.png';
import KilometrajeIcon from './imagenesIconos/velocimetro.png';
import TransmisionIcon from './imagenesIconos/caja-de-cambios.png';
import CombustibleIcon from './imagenesIconos/gasolinera.png';
import { Auto } from '@/types/auto';
import { Comentario } from '@/types/auto';

interface Props {
  auto: Auto;
}

export default function DetalleCocheCliente({ auto }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [imagenActual, setImagenActual] = useState(0); 
  const listaComentariosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/autos/${auto.id}/comentarios`)
      .then(res => res.json())
      .then(data => {
        setComentarios(data.data);
      })
      .catch(err => {
        console.error('Error al obtener comentarios:', err);
        setComentarios([]);
    });
  }, [auto.id]);

  const siguienteImagen = () => {
    if (imagenActual < auto.imagenes?.length - 1) {
      setImagenActual(imagenActual + 1);
    } else {
      setImagenActual(0);
    }
  };

  const imagenAnterior = () => {
    if (imagenActual > 0) {
      setImagenActual(imagenActual - 1);
    } else {
      setImagenActual(auto.imagenes?.length - 1); 
    }
  };

  const promedioCalificacion = useMemo(() => {
    if (comentarios.length == 0) return 0;
    const suma = comentarios.reduce((acc, comentario) => acc + comentario.calificacion, 0);
    return parseFloat((suma / comentarios.length).toFixed(1));
  }, [comentarios]);

  const obtenerEstrellas = (promedio: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (promedio >= i) {
        estrellas.push(<FaStar key={i} color="#FFD700" />);
      } else if (promedio >= i - 0.5) {
        estrellas.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      } else {
        estrellas.push(<FaRegStar key={i} color="#FFD700" />);
      }
    }
    return estrellas;
  };  
  const distribucionEstrellas = useMemo(() => {
    const total = comentarios.length;
    const conteo: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
    comentarios.forEach(c => {
      conteo[c.calificacion] = (conteo[c.calificacion] || 0) + 1;
    });
  
    const porcentajes = Object.fromEntries(
      Object.entries(conteo).map(([estrella, cantidad]) => [
        estrella,
        total === 0 ? 0 : Math.round((cantidad / total) * 100),
      ])
    );
  
    return { conteo, porcentajes };
  }, [comentarios]);

  const criterioTexto = useMemo(() => {
    if (promedioCalificacion >= 4.5) return 'Muy bueno';
    if (promedioCalificacion >= 3.5) return 'Bueno';
    if (promedioCalificacion >= 2.5) return 'Regular';
    if (promedioCalificacion >= 1.5) return 'Malo';
    return 'Muy malo';
  }, [promedioCalificacion]);
  return (
    <>
      {mostrarPanel && (
  <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[999]"
    onClick={() => setMostrarPanel(false)}
  />
)}

<div
  className={`fixed top-0 w-[600px] h-screen bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out z-[1000] p-4 flex flex-col overflow-y-auto ${
    mostrarPanel ? 'right-0' : '-right-[600px]'
  }`}
>
  <button
    className="absolute top-[10px] right-[20px] bg-[#fca311] text-[20px] text-white w-6 h-6 flex items-center justify-center rounded-full border-none cursor-pointer"
    onClick={() => setMostrarPanel(false)}
  >
    ✕
  </button>
  
  <div className="p-4 border-b border-[#ccc]">
    <h2 className="text-black text-[30px]"><i>{auto.marca}{' '}{auto.modelo}</i></h2>
    <hr className="border-t-4 border-black"/>
    <h3 className="text-black text-[20px]"><i>Puntuaciones del auto</i></h3>
    <div className="flex gap-4 items-center">
      <div className="bg-[#002a5c] text-white text-[1.5rem] p-2 rounded w-12 text-center"
      >{promedioCalificacion.toFixed(1)}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="flex flex-row text-[#257ba5] text-[20px]">
        {obtenerEstrellas(promedioCalificacion)}</div>
        <div>
          <div className="text-black font-bold">{criterioTexto}</div>
          <div className="text-[rgb(8,8,8)] text-sm">{comentarios.length} en total</div>
        </div>
      </div>
    </div>

    <div className="mt-4">
      {[5, 4, 3, 2, 1].map((estrella) => (
        <div key={estrella} className="flex items-center my-1.5">
          <span className="bg-[#003366] text-white py-[2px] px-2 rounded-[3px] font-bold text-[0.85rem]">
            {estrella}</span>
          <div className="w-[500px] h-[10px] bg-[#ddd] rounded-[4px] overflow-hidden mx-[10px]">
            <div
              className="h-full bg-[#002a5c]"
              style={{ width: `${distribucionEstrellas.porcentajes[estrella]}%` }}
            ></div>
          </div>
          <span style={{color: 'black'}}>{distribucionEstrellas.porcentajes[estrella]}%</span>
        </div>
      ))}
    </div>
  </div>
  
  <h2 className="text-black text-[20px]"><i>Comentarios</i></h2>
  <div className="flex flex-col mt-8 gap-5 pr-2.5" 
      ref={listaComentariosRef}>
      {comentarios.length === 0 ? (
        <p>No hay comentarios todavía.</p>
      ) : (
        comentarios.map((comentario) => {
          const fechaObj = new Date(comentario.fechaCreacion);
          
          const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const calificacion = comentario.calificacion;
          const estrellasLlenas = Math.floor(calificacion);
          const estrellasVacias = 5 - estrellasLlenas;
          return (
            <div key={comentario.id} className="bg-white pb-3 mb-4 border-b-2 border-black flex flex-col w-full">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <Image 
                  src={UsuarioIcon} 
                  alt="Icono de persona"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col text-black">
                  <strong>{comentario.usuario.nombre} {comentario.usuario.apellido}</strong>
                  <div className="text-gray-600 text-sm">{fechaFormateada}</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex flex-row text-[#fca311] text-xl">
                  {[...Array(estrellasLlenas)].map((_, i) => <FaStar key={`llena-${i}`} />)}
                  {[...Array(estrellasVacias)].map((_, i) => <FaRegStar key={`vacia-${i}`} />)}
                </div>
                <div className="bg-[#003366] text-white px-2 py-1 rounded-[3px] font-bold text-[0.85rem]">
                  {calificacion}
                </div>
              </div>
            </div>
          
            <p className="text-[#0a0707] text-justify whitespace-pre-wrap break-words w-full">
              {comentario.contenido}</p>
          </div>              
          )
        })
      )}
    </div>
</div>

      <div className="w-full max-w-[1500px] mx-auto p-5 bg-white text-[#292929]">
        <h1 className="text-[#11295B] text-[2.5rem] mb-5">{auto.marca} - {auto.modelo}</h1>

        <div className="grid grid-cols-[1fr_2fr_1fr] gap-7.5">
          <div>
            <div className="relative w-full max-w-full h-[250px] border border-black rounded-[20px] overflow-hidden bg-white">
              
              {/* Flecha izquierda */}
              <div className="absolute top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50 transition-colors duration-200 ease-in-out"
                onClick={imagenAnterior}>
                {'<'}
              </div>

              {/* Contenedor de imágenes */}
              <div className="relative w-full max-w-full h-[250px] border border-black rounded-[20px] overflow-hidden bg-white">
                {auto.imagenes && (
                  <Image
                    key={auto.imagenes[imagenActual].id}
                    src={auto.imagenes[imagenActual].direccionImagen}
                    alt={`Imagen del auto ${auto.marca} ${auto.modelo}`}
                    className="relative w-full max-w-full h-[250px] border border-black rounded-[20px] overflow-hidden bg-white"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Flecha derecha */}
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50 transition-colors duration-200 ease-in-out"
                onClick={siguienteImagen}>
                {'>'}
              </div>
            </div>
            <div className="mt-[15px]">
              <div className="flex items-center justify-start gap-[10px] p-[10px]">
                <span className="font-bold text-[18px] text-[#11295B]">Puntuación {promedioCalificacion}</span>
                <span className="flex flex-row text-[#fca311] text-[20px]">
                  {obtenerEstrellas(promedioCalificacion)}
                </span>
              </div>
              <button className="m-0 inline-block bg-[#fca311] text-white 
                        px-5 py-2.5 border-none rounded-full 
                        text-base font-semibold font-inter text-center 
                        no-underline cursor-pointer 
                        transition duration-300 ease-in-out 
                        shadow-md hover:bg-[#e69500] hover:-translate-y-0.5 hover:shadow-lg 
                        active:bg-[#cc8400] active:translate-y-0 active:shadow-sm"
                    onClick={() => setMostrarPanel(true)}>
                Ver Reseñas
              </button>
            </div>

            {/*HASTA AQUI YO*/}
            
            <div className="bg-white relative top-[-10px] left-[5px] w-[530px] h-[250px]">
              <h3 className="text-[#11295B] text-[1.5rem] font-semibold mt-5">Detalles</h3>
              <div className="mt-2">
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-5 mt-2">
                  <div className="flex gap-2 text-[16px]">
                    <strong>Año:</strong>
                    <span>{auto.año}</span>
                  </div>
                  <div className="flex gap-2 text-[16px]">
                    <strong>Placa:</strong>
                    <span>{auto.placa}</span>
                  </div>
                  <div className="flex gap-2 text-[16px]">
                    <strong>Color:</strong>
                    <span>{auto.color}</span>
                  </div>
                </div>
                <h4 className="text-[#11295B] text-[1.5rem] font-semibold mt-5">Descripción</h4>
                <div className="text-[16px]">{auto.descripcion}</div>
              </div>
            </div>
          </div>
          <div>

            <div className="bg-white p-5 w-full box-border">
              <h2 className="text-[#11295B] text-[1.5rem] font-bold mb-4">Características Principales</h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <Image 
                    src={UsuarioIcon} 
                    alt="Icono de personas"
                    className="w-[50px] h-[50px] flex-shrink-0"
                  />
                  <div className="flex flex-col text-[14px] flex-grow">
                    <span className="font-bold text-black text-[16px] whitespace-nowrap">{auto.capacidad} personas</span>
                    <span>Capacidad</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <Image 
                    src={KilometrajeIcon} 
                    alt="Icono de kilometraje" 
                    className="w-[50px] h-[50px] flex-shrink-0"
                  />
                  <div className="flex flex-col text-[14px] flex-grow">
                    <span className="font-bold text-black text-[16px] whitespace-nowrap">{auto.kilometraje}</span>    
                    <span>Kilometraje</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <Image 
                    src={TransmisionIcon} 
                    alt="Icono de transmisión" 
                    className="w-[50px] h-[50px] flex-shrink-0"
                  />
                  <div className="flex flex-col text-[14px] flex-grow">
                    <span className="font-bold text-black text-[16px] whitespace-nowrap">{auto.transmision}</span>   
                    <span>Transmisión</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <Image 
                    src={CombustibleIcon} 
                    alt="Icono de combustible" 
                    className="w-[50px] h-[50px] flex-shrink-0"
                  />
                  <div className="flex flex-col text-[14px] flex-grow">
                    <span className="font-bold text-black text-[16px] whitespace-nowrap">{auto.combustible}</span>        
                    <span>Combustible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-5 justify-between w-full items-start">
            <div className="flex-1 min-w-[300px]">
              <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md">
                <h3 className="text-[#11295b] font-semibold text-lg text-center mb-4 pb-2">
                  Datos del host
                </h3>
                <div className="flex justify-center">
                    <Image 
                      src={UsuarioIcon} 
                      alt="Icono de persona"
                      className="w-[80px] h-[80px] bg-[#ccc] rounded-full mb-4"
                    />
                  </div>
                <div className="text-center text-[#333] text-lg">
                  Nombre: {auto.propietario?.nombre} {auto.propietario?.apellido}
                </div>
              </div>
            </div>

                <div className="flex-1 min-w-[300px]">
                  <div className="bg-[#f5f5f5] p-4 rounded-lg shadow-md">
                    <h3 className="text-[#11295b] font-semibold text-lg mb-4">
                      Desglose del precio
                    </h3>

                    <div className="flex justify-between mt-2">
                      <div>Precio por día:</div>
                      <div>{auto?.precioRentaDiario}{' USD'}</div>
                    </div>

                    <div className="text-[#333] mt-2 text-right">
                        {(parseFloat(auto?.precioRentaDiario) * 6.89).toFixed(2)}{' BOB'}
                      </div>

                    <div className="flex justify-between mt-4">
                      <div>Precio total:</div>
                      <div>{(parseFloat(auto?.precioRentaDiario) * 6.89 * 5).toFixed(2)}{' BOB'}</div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </>
  );
}
