'use client';

import { useState, useEffect, useMemo, useRef} from 'react';
import styles from './detalleCoche.module.css';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import UsuarioIcon from './imagenesIconos/usuario.png';
import KilometrajeIcon from './imagenesIconos/velocimetro.png';
import TransmisionIcon from './imagenesIconos/caja-de-cambios.png';
import CombustibleIcon from './imagenesIconos/gasolinera.png';
import { Auto } from '@/types/auto';
import { Comentario } from '@/types/auto';
import { FaStar, FaRegStar } from 'react-icons/fa';

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

  return (
    <>
      {mostrarPanel && (<div className={styles.estiloOpaco} onClick={() => setMostrarPanel(false)} />)}
      <div className={`${styles.panelReseñas} ${mostrarPanel ? styles.visible : ''}`}>
  <button className={`${styles.cerrarPanel } ${styles.boton}`} onClick={() => setMostrarPanel(false)}>✕</button>
  <div className={styles.listaComentarios} ref={listaComentariosRef}> {/* ← añadido ref */}
          {comentarios.length === 0 ? (
            <p>No hay comentarios todavía.</p>
          ) : (
            comentarios.map((comentario) => {
              // Convertimos el string de fecha a un objeto Date
              const fechaObj = new Date(comentario.fechaCreacion); // Asegúrate de que `comentario.fecha` sea '2025/04/14'
              
              // Formateamos la fecha al estilo "14 de abril de 2025"
              const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              const calificacion = comentario.calificacion;
              const estrellasLlenas = Math.floor(calificacion);
              const estrellasVacias = 5 - estrellasLlenas;
              return (
                <div key={comentario.id} className={styles.comentario}>
                <div className={styles.superior}>
                  <div className={styles.usuarioInfo}>
                    <Image 
                      src={UsuarioIcon} 
                      alt="Icono de persona"
                      className={styles.iconoUsuario}
                    />
                    <div className={styles.nombreYFecha}>
                      <strong>{comentario.usuario.nombre} {comentario.usuario.apellido}</strong>
                      <div className={styles.fecha}>{fechaFormateada}</div>
                    </div>
                  </div>
                  <div className={styles.estrellasYNota}>
                    <div className={styles.estrellas}>
                      {[...Array(estrellasLlenas)].map((_, i) => <FaStar key={`llena-${i}`} />)}
                      {[...Array(estrellasVacias)].map((_, i) => <FaRegStar key={`vacia-${i}`} />)}
                    </div>
                    <div className={styles.nota}>
                      {calificacion}
                    </div>
                  </div>
                </div>
              
                <p className={styles.contenidoComentario}>{comentario.contenido}</p>
              </div>              
              )
            })
          )}
        </div>
      </div>

      <div className={styles.contenedor}>
        <h1 className={styles.titulo}>{auto.marca} - {auto.modelo}</h1>

        <div className={styles.contenido}>
          <div className={styles.seccionIzquierda}>
            <div className={styles.imagenAuto}>
              
              {/* Flecha izquierda */}
              <div className={`${styles.flechaNavegacion} ${styles.flechaIzquierda}`} onClick={imagenAnterior}>
                {'<'}
              </div>

              {/* Contenedor de imágenes */}
              <div className={styles.imagenAuto}>
                {auto.imagenes && (
                  <Image
                    key={auto.imagenes[imagenActual].id}
                    src={auto.imagenes[imagenActual].direccionImagen}
                    alt={`Imagen del auto ${auto.marca} ${auto.modelo}`}
                    className={styles.imagenAuto}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Flecha derecha */}
              <div className={`${styles.flechaNavegacion} ${styles.flechaDerecha}`} onClick={siguienteImagen}>
                {'>'}
              </div>
            </div>
            <div className={styles.contenedorCalificacion}>
              <div className={styles.calificacion}>
                <span className={styles.puntuacion}>Puntuación {promedioCalificacion}</span>
                <span className={styles.estrellas}>
                  {obtenerEstrellas(promedioCalificacion)}
                </span>
              </div>
              <button className={styles.boton}
                    onClick={() => setMostrarPanel(true)}>
                Ver Reseñas
              </button>
            </div>
            
            <div className={styles.contenedorDetalles}>
              <h3 className={styles.subtituloDetalles}>Detalles</h3>
              <div className={styles.detalles}>
                <div className={styles.gridDetalles}>
                <div className={styles.filaDetalle}>
                  <span className={styles.etiqueta}>Año:</span>
                  <span className={styles.valor}>{auto.año}</span>
                </div>
                <div className={styles.filaDetalle}>
                  <span className={styles.etiqueta}>Placa:</span>
                  <span className={styles.valor}>{auto.placa}</span>
                </div>
                <div className={styles.filaDetalle}>
                  <span className={styles.etiqueta}>Color:</span>
                  <span className={styles.valor}>{auto.color}</span>
                </div>
                </div>
                <h4 className={styles.subtituloDetalles}>Descripcion</h4>
                <span className={styles.valor}>{auto.descripcion}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className={styles.caracteristicas}>
              <h2 className={styles.tituloCaracteristicas}>Características Principales</h2>
              <div className={styles.gridCaracteristicas}>
                <div className={styles.caracteristica}>
                  <Image 
                    src={UsuarioIcon} 
                    alt="Icono de personas"
                    className={styles.iconoCaracteristica}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.capacidad} personas</span>
                    <span>Capacidad</span>
                  </div>
                </div>
                <div className={styles.caracteristica}>
                  <Image 
                    src={KilometrajeIcon} 
                    alt="Icono de kilometraje" 
                    className={styles.iconoCaracteristica}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.kilometraje}</span>    
                    <span>Kilometraje</span>                                                      
                  </div>
                </div>
                <div className={styles.caracteristica}>
                  <Image 
                    src={TransmisionIcon} 
                    alt="Icono de transmisión" 
                    className={styles.iconoCaracteristica}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.transmision}</span>   
                    <span>Transmisión</span>                                    
                  </div>
                </div>
                <div className={styles.caracteristica}>
                  <Image 
                    src={CombustibleIcon} 
                    alt="Icono de combustible" 
                    className={styles.iconoCaracteristica}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.combustible}</span>        
                    <span>Combustible</span>                                                   
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.panelLateral}>
            <div className={styles.tarjetaAnfitrion}>
              <h3 className={styles.tituloAnfitrion}>Datos del host</h3>
              <div className={styles.avatarAnfitrion}></div>
              <div className={styles.nombreAnfitrion}>Nombre: {auto.propietario?.nombre}</div>
            </div>
            
            <div className={styles.tarjetaPrecio}>
              <h3 className={styles.tituloPrecio}>Desglose del precio</h3>
              <div className={styles.filaPrecio}>
                <div>Precio por día:</div>
                <div>{auto.precioRentaDiario}</div>
              </div>
              <div className={styles.filaMoneda}>{auto.precioRentaDiario}</div>
              <div className={styles.precioTotal}>
                <div>precio total:</div>
                <div>519.75 BOB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
