import { Auto } from '@/types/auto';
import { notFound } from 'next/navigation';
import styles from './detalleCoche.module.css';

/**imagenes de los iconos */
import Image from 'next/image';
import UsuarioIcon from './imagenesIconos/usuario.png';
import KilometrajeIcon from './imagenesIconos/velocimetro.png';
import TransmisionIcon from './imagenesIconos/caja-de-cambios.png';
import CombustibleIcon from './imagenesIconos/gasolinera.png';
import EquipajeIcon from './imagenesIconos/maleta.png';
/**------------ */
interface DetalleCocheProps {
  params: {
    id: string;
  };
}

export default async function DetalleCoche({ params }: DetalleCocheProps) {
  const { id } = params;
  
  // Realiza la solicitud a tu API para obtener los datos del auto
  const res = await fetch(`http://localhost:4000/api/autos/${id}`);
  
  if (!res.ok) {
    notFound();
  }
  
  const data = await res.json();
  const auto: Auto = data.data;

  return (
    <div className={styles.contenedor}>
      
      <h1 className={styles.titulo}>{auto.marca}-{auto.modelo}</h1>
      
      <div className={styles.contenido}>
        <div className={styles.seccionIzquierda}>
          <div className={styles.imagenAuto}>
            <div className={`${styles.flechaNavegacion} ${styles.flechaIzquierda}`}>{'<'}</div>
            <div className={styles.siluetaAuto}></div>
            <div className={`${styles.flechaNavegacion} ${styles.flechaDerecha}`}>{'>'}</div>
          </div>
          
          <div className={styles.contenedorCalificacion}>
            <div className={styles.calificacion}>
              <span className={styles.puntuacion}>Puntuación 4.2</span>
              <span className={styles.estrellas}>★★★★☆</span>
            </div>
             <a href="#" className={styles.insigniaVerificado}>Ver Reseñas</a>
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
                  <span className={styles.valorCaracteristica}>{auto.kilometraje}</span>         {/*{auto.transmision}*/}
                  <span>Kilometraje</span>                                                        {/*Transmisión */}
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
                  <span className={styles.valorCaracteristica}>{auto.transmision}</span>            {/**{auto.capacidad} */}
                  <span>Transmisión</span>                                     {/**Capacidad de equipaje */}
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
                  <span className={styles.valorCaracteristica}>{auto.combustible}</span>            {/* {auto.kilometraje}*/}
                  <span>Combustible</span>                                                      {/*Kilometraje*/}
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
                  <span className={styles.valorCaracteristica}>{auto.capacidad}</span>        {/** {auto.combustible}*/}
                  <span>Capacidad de equipaje </span>                                                         {/**Combustible */}
                </div>  
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.panelLateral}>
          <div className={styles.tarjetaAnfitrion}>
            <h3 className={styles.tituloAnfitrion}>Datos del host</h3>
            <div className={styles.avatarAnfitrion}></div>
            <div className={styles.nombreAnfitrion}>Nombre:</div>
          </div>
          
          <div className={styles.tarjetaPrecio}>
            <h3 className={styles.tituloPrecio}>Desglose del precio</h3>
            <div className={styles.filaPrecio}>
              <div>Precio por día:</div>
              <div>75$</div>
            </div>
            <div className={styles.filaMoneda}>519.75 BOB</div>
            <div className={styles.precioTotal}>
              <div>precio total:</div>
              <div>519.75 BOB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}