'use client';

import Navbar from '@/app/components/navbar/NavbarDetalle';
import { useState, useEffect, useMemo, useRef} from 'react';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import UsuarioIcon from './imagenesIconos/usuario.png';
import KilometrajeIcon from './imagenesIconos/velocimetro.png';
import TransmisionIcon from './imagenesIconos/caja-de-cambios.png';
import CombustibleIcon from './imagenesIconos/gasolinera.png';
import MaletaIcon from './imagenesIconos/maleta.png';
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
  // Estado para rastrear qué comentarios están expandidos
  const [comentariosExpandidos, setComentariosExpandidos] = useState<Record<number, boolean>>({});
  const refsComentarios = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [comentariosConOverflow, setComentariosConOverflow] = useState<Record<number, boolean>>({});

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
  //bloqueo de scroll al abrir panel, quitar si no funciona :'v
  useEffect(()=>{
    document.body.style.overflow = mostrarPanel ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mostrarPanel]);
  // para los comentarios - resenias, observar los tamanios en los comentarios

  useEffect(() => {
    const observers: ResizeObserver[] = [];
  
    comentarios.forEach((comentario) => {
      const el = refsComentarios.current[comentario.id];
      if (el) {
        const observer = new ResizeObserver(() => {
          const isOverflowing = el.scrollHeight > el.clientHeight + 2;
          setComentariosConOverflow((prev) => ({
            ...prev,
            [comentario.id]: isOverflowing,
          }));
        });
        observer.observe(el);
        observers.push(observer);
      }
    });
  
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [comentarios]);
  

  // Función para alternar la expansión de un comentario
  const toggleExpansion = (comentarioId: number) => {
    setComentariosExpandidos(prev => ({
      ...prev,
      [comentarioId]: !prev[comentarioId]
    }));
  };

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
    const comentariosValidos = comentarios.filter(
      comentario => comentario.calificacion > 0 && comentario.contenido && comentario.contenido.trim() !== ""
    );
    if (comentariosValidos.length === 0) return 0;
    const suma = comentariosValidos.reduce((acc, comentario) => acc + comentario.calificacion, 0);
    return parseFloat((suma / comentariosValidos.length).toFixed(1));
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
    const comentariosValidos = comentarios.filter(
      comentario => comentario.calificacion > 0 && comentario.contenido && comentario.contenido.trim() !== ""
    );
    const total = comentariosValidos.length;
    const conteo: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
    comentariosValidos.forEach(c => {
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
    return 'Sin calificacion';
  }, [promedioCalificacion]);
  
  return (
    <>
      <Navbar />
      
      {mostrarPanel && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[999]"
          onClick={() => setMostrarPanel(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[90%] md:w-[600px] bg-white shadow-[-2px_0_8px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out z-[1000] p-4 flex flex-col overflow-y-auto border-[3px] border-black rounded-tl-[20px] rounded-bl-[20px] ${
          mostrarPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-[30px] right-[20px] bg-[#fca311] text-[20px] text-white w-9 h-9 flex items-center justify-center rounded-[10px] border-[2px] border-black cursor-pointer"
          onClick={() => setMostrarPanel(false)}
        >
          ✕
        </button>
        
        <div className="p-4 border-b border-[#ccc]">
          <h2 className="text-black text-[30px]"><i>{auto.marca}{' - '}{auto.modelo}</i></h2>
          <hr className="border-t-4 border-black"/>
          <h3 className="text-black text-[20px]"><i>Calificación del auto</i></h3>
          <div className="flex gap-4 items-center">
            <div className="bg-[#002a5c] text-white text-[1.5rem] p-2 rounded w-12 text-center"
            >{promedioCalificacion.toFixed(1)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="flex flex-row text-[#257ba5] text-[20px]">
                {obtenerEstrellas(promedioCalificacion)}</div>
              <div>
                <div className="text-black font-bold">{criterioTexto}</div>
                <div className="text-[rgb(8,8,8)] text-sm">
                  {comentarios.filter(c => c.calificacion > 0 && c.contenido && c.contenido.trim() !== "").length} en total
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((estrella) => (
              <div key={estrella} className="flex items-center">
                <div className="bg-[#002a5c] text-white font-medium w-8 h-8 flex items-center justify-center">
                  {estrella}
                </div>
                <div className="w-full max-w-md h-[16px] bg-gray-200 mx-3 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-[#002a5c] rounded-md"
                    style={{ width: `${distribucionEstrellas.porcentajes[estrella]}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-black">
                  {distribucionEstrellas.porcentajes[estrella]}%
                </span>
                <span className="text-sm text-gray-600 ml-1">
                  ({distribucionEstrellas.conteo[estrella]})
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <h2 className="text-black text-[20px]"><i>Comentarios</i></h2>
        <div className="flex flex-col mt-8 gap-5 pr-2.5 text-black" ref={listaComentariosRef}>
          {comentarios.length === 0 || !comentarios.some(c => c.calificacion > 0 && c.contenido && c.contenido.trim() !== "") ? (
            <p>Sin comentarios.</p>
          ) : (
            comentarios
              .filter(c => c.calificacion > 0 && c.contenido && c.contenido.trim() !== "")
              .map((comentario) => {
                const fechaObj = new Date(comentario.fechaCreacion);
                const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                const calificacion = comentario.calificacion;
                const estrellasLlenas = Math.floor(calificacion);
                const estrellasVacias = 5 - estrellasLlenas;
                const estaExpandido = comentariosExpandidos[comentario.id] || false;

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

                    <div className="text-[#0a0707] text-justify whitespace-pre-wrap break-words w-full mt-2">
                      <p
                        ref={(el) => {
                          refsComentarios.current[comentario.id] = el;
                        }}
                        className={`${!estaExpandido ? 'line-clamp-3' : ''} transition-all duration-200`}
                      >
                        {comentario.contenido}
                      </p>

                      {(comentariosConOverflow[comentario.id] || estaExpandido) && (
                        <button 
                          onClick={() => toggleExpansion(comentario.id)}
                          className="text-[#002a5c] font-medium hover:underline mt-1 focus:outline-none"
                        >
                          {estaExpandido ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}

                    </div>
                  </div>
                );
              })
          )}
        </div>


      </div>

      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pb-10">
        <div className="max-w-[1550px] mx-auto">
          <h1 className="mt-6 sm:mt-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[var(--azul-oscuro)] font-bold text-left pl-2 sm:pl-4 mb-6">
            {auto.marca} - {auto.modelo}
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* SECCIÓN IZQUIERDA */}
            <div className="flex-1 min-w-[450px] max-w-full">
              <div className="relative w-full h-[250px] border border-black rounded-[20px] overflow-hidden">
                <div
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50"
                  onClick={imagenAnterior}
                >
                  {'<'}
                </div>

                {auto.imagenes && (
                  <Image
                    key={auto.imagenes[imagenActual].id}
                    src={auto.imagenes[imagenActual].direccionImagen}
                    alt={`Imagen del auto ${auto.marca} ${auto.modelo}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-[20px]"
                  />
                )}

                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50"
                  onClick={siguienteImagen}
                >
                  {'>'}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg text-[#11295B]">
                    Calificación {promedioCalificacion}
                  </span>
                  <span className="flex text-[#fca311] text-xl">
                    {obtenerEstrellas(promedioCalificacion)}
                  </span>
                </div>
                <button
                  className="bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition duration-300 hover:bg-[#e69500] active:bg-[#cc8400]"
                  onClick={() => setMostrarPanel(true)}
                >
                  Ver Reseñas
                </button>
              </div>

              {/* DETALLES */}
              <div className="bg-white mt-5">
                <h3 className="text-[#11295B] text-xl font-semibold">Detalles</h3>

                <div className="flex flex-wrap gap-x-6 gap-y-4 mt-3">
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Año:</strong>
                    <span className="font-normal text-black">{auto.año}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Placa:</strong>
                    <span className="font-normal text-black">{auto.placa.replace('-', '\u2011')}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Color:</strong>
                    <span className="font-normal text-black">{auto.color}</span>
                  </div>
                </div>

                <h4 className="text-[#11295B] text-lg font-semibold mt-4">Descripción</h4>
                <p className="font-normal text-black">{auto.descripcion}</p>
              </div>
            </div>

            {/* SECCIÓN CENTRAL */}
            <div className="flex-1 min-w-[200px] max-w-full">
              <div className="bg-white p-5 w-full">
                <h2 className="text-[#11295B] text-xl font-bold mb-4">Características Principales</h2>
                <div className="flex flex-wrap gap-10">
                  {[
                    { icon: UsuarioIcon, label: 'Capacidad', value: `${auto.capacidad} personas` },
                    { icon: KilometrajeIcon, label: 'Kilometraje', value: `${auto.kilometraje} km` },
                    { icon: TransmisionIcon, label: 'Transmisión', value: auto.transmision },
                    { icon: CombustibleIcon, label: 'Combustible', value: `${auto.combustible} personas` },
                    { icon: MaletaIcon, label: 'Capacidad', value: `${auto.capacidadMaletero} personas` },
                  ].map(({ icon, label, value }, index) => (
                    <div key={index} className="flex items-center gap-4 flex-wrap">
                      <Image src={icon} alt={label} className="w-[50px] h-[50px]" />
                      <div className="flex flex-col">
                        <span className="font-bold text-[16px] text-black whitespace-nowrap">{value}</span>
                        <span className="text-[14px] text-[#292929]">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN DERECHA */}
            <div className="flex-1 min-w-[250px] max-w-full">
              <div className="flex flex-wrap gap-10">
                <div className="bg-[#f5f5f5] p-6 w-full min-w-[250] max-w-[400px] rounded-2xl shadow-md border-2 border-black">
                  <h3 className="text-[#11295b] font-semibold text-center mb-4">Datos del host</h3>
                  <div className="flex justify-center mb-4">
                    <div className="w-[80px] h-[80px] bg-[#ccc] rounded-full flex items-center justify-center">
                      <Image src={UsuarioIcon} alt="Host" className="w-[80px] h-[80px]" />
                    </div>
                  </div>
                  <p className="text-center text-[#333] text-lg mb-0">
                    {auto.propietario?.nombre} {auto.propietario?.apellido}
                  </p>
                </div>

                <div className="bg-[#f5f5f5] p-6 w-full min-w-[250] max-w-[400px] rounded-2xl shadow-md border-2 border-black">
                  <h3 className="text-[#11295b] font-semibold text-lg mb-4">Desglose del precio</h3>
                  <div className="flex justify-between">
                    <span className="font-normal text-black">Precio por día:</span>
                    <span className="font-normal text-black">{auto?.precioRentaDiario} USD</span>
                  </div>
                  <div className="font-normal text-black text-right mt-1">
                    {(parseFloat(auto?.precioRentaDiario) * 6.89).toFixed(2)} BOB
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="font-normal text-black">Precio total:</span>
                    <span className="font-normal text-black">
                      {(parseFloat(auto?.precioRentaDiario) * 6.89 * 5).toFixed(2)} BOB
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}