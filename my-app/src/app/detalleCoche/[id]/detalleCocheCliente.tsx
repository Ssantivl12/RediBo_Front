'use client';

import { useState } from 'react';
import styles from './detalleCoche.module.css';
import Image from 'next/image';

import UsuarioIcon from './imagenesIconos/usuario.png';
import KilometrajeIcon from './imagenesIconos/velocimetro.png';
import TransmisionIcon from './imagenesIconos/caja-de-cambios.png';
import CombustibleIcon from './imagenesIconos/gasolinera.png';
import EquipajeIcon from './imagenesIconos/maleta.png';
import { Auto } from '@/types/auto';

interface Props {
  auto: Auto;
}

export default function DetalleCocheCliente({ auto }: Props) {
  console.log("IMAGENES:", auto.imagenes);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [imagenActual, setImagenActual] = useState(0); // Estado para controlar la imagen actual

  // Función para mostrar la imagen siguiente
  const siguienteImagen = () => {
    if (imagenActual < auto.imagenes?.length - 1) {
      setImagenActual(imagenActual + 1);
    } else {
      setImagenActual(0); // Si es la última, vuelve a la primera
    }
  };

  // Función para mostrar la imagen anterior
  const imagenAnterior = () => {
    if (imagenActual > 0) {
      setImagenActual(imagenActual - 1);
    } else {
      setImagenActual(auto.imagenes?.length - 1); // Si es la primera, va a la última
    }
  };

  return (
    <>
      {mostrarPanel && (<div className={styles.estiloOpaco} onClick={() => setMostrarPanel(false)} />)}
      <div className={`${styles.panelReseñas} ${mostrarPanel ? styles.visible : ''}`}>
        <button className={styles.cerrarPanel} onClick={() => setMostrarPanel(false)}>✕</button>
        <h2>Contenido del Panel</h2>
        <p>Aquí irían las reseñas o información adicional.</p>
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
                    className={styles.imagen}
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
                <span className={styles.puntuacion}>Puntuación 4.2</span>
                <span className={styles.estrellas}>★★★★☆</span>
              </div>
              <button className={styles.boton}
                    onClick={() => setMostrarPanel(true)}>
                Ver Reseñas
              </button>
            </div>
            
            <div className={styles.contenedorDetalles}>
              <h3 className={styles.subtituloDetalles}>Detalles</h3>
              <div className={styles.detalles}>
                {/* Detalles adicionales pueden ir aquí */}
              </div>
            </div>
          </div>
          
          <div className={styles.seccionInformacion}>
            <div className={styles.caracteristicas}>
              <h2 className={styles.tituloCaracteristicas}>Características Principales</h2>
              <div className={styles.gridCaracteristicas}>
                <div className={styles.caracteristica}>
                  <Image 
                    src={UsuarioIcon} 
                    alt="Icono de personas" 
                    className={styles.iconoCaracteristica}
                    width={30}
                    height={30}
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
                    width={30}
                    height={30}
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
                    width={30}
                    height={30}
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
                    width={30}
                    height={30}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.combustible}</span>        
                    <span>Combustible</span>                                                   
                  </div>
                </div>
                <div className={styles.caracteristica}>
                  <Image 
                    src={EquipajeIcon} 
                    alt="Icono de equipaje" 
                    className={styles.iconoCaracteristica}
                    width={30}
                    height={30}
                  />
                  <div className={styles.textoCaracteristica}>
                    <span className={styles.valorCaracteristica}>{auto.capacidad}</span>       
                    <span>Capacidad de equipaje </span>                                                  
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
