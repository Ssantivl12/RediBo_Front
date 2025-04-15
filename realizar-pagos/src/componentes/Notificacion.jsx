// src/componentes/Notificacion.jsx
import { useNavigate } from 'react-router-dom'; //
import React from 'react';

const eventos = [
  {
    id: 1,
    nombre: 'Daniel Garcia',
    estado: 'aprobado',
    vehiculo: 'Toyota Camry',
    fecha: '20 de abril de 2025',
    imagenPersona:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVbrLEAIpEsQgHkoVWfqYEBqGZ9AnQgAqrZg&s',
    imagenAuto: 'https://img.etimg.com/thumb/width-1200,height-900,imgsize-2042443,resizemode-75,msid-105789918/industry/auto/cars-uvs/revuelto-hybrid-lamborghinis-most-expensive-model-in-india-sold-out-till-2026.jpg'
  },
  {
    id: 2,
    nombre: 'Carla Camacho',
    estado: 'aprobado',
    vehiculo: 'Tesla Model 3',
    fecha: '15 de mayo de 2025',
    imagenPersona: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4FgQ4-ysK1pjWLPaZBGypJAbHs8gGemPmvQ&s',
    imagenAuto: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/models_gw/2025/s2-mobile.jpg'
  },
  {
    id: 3,
    nombre: 'Elsa Carvajal',
    estado: 'rechazado',
    vehiculo: 'Jeep Grand Cherokee',
    fecha: '5 de marzo de 2025',
    imagenPersona: 'https://i.pravatar.cc/150?img=41',
    imagenAuto: 'https://carmania.mx/wp-content/uploads/2023/03/CN023_003MP-scaled.jpg'
  },
  {
    id: 4,
    nombre: 'David Montenegro',
    estado: 'rechazado',
    vehiculo: 'Ford Explorer',
    fecha: '20 de febrero de 2025',
    imagenPersona: 'https://i.pravatar.cc/150?img=68',
    imagenAuto: 'https://marcasdecoches.info/wp-content/uploads/2019/03/F8-Tributo-first-of-5-new-Ferraris-due-in-2019-mejores-marcas-de-coches-Europeos-Italianos-1024x607.jpg'
  },
  {
    id: 5,
    nombre: 'Carlos Maldonado',
    estado: 'aprobado',
    vehiculo: 'Lamborghini Huracan Spyder',
    fecha: '26 de marzo de 2025',
    imagenPersona: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
    imagenAuto: 'https://cdn.autobild.es/sites/navi.axelspringer.es/public/media/image/2017/03/620595-colores-que-no-habias-visto-coches.jpg?tf=1920x'
  },{
    id: 6,
    nombre: 'Elsa Carvajal',
    estado: 'rechazado',
    vehiculo: 'Jeep Grand Cherokee',
    fecha: '5 de marzo de 2025',
    imagenPersona: 'https://i.pravatar.cc/150?img=41',
    imagenAuto: 'https://carmania.mx/wp-content/uploads/2023/03/CN023_003MP-scaled.jpg'
  },
  {
    id: 7,
    nombre: 'Elsa Carvajal',
    estado: 'rechazado',
    vehiculo: 'Jeep Grand Cherokee',
    fecha: '5 de marzo de 2025',
    imagenPersona: 'https://i.pravatar.cc/150?img=41',
    imagenAuto: 'https://carmania.mx/wp-content/uploads/2023/03/CN023_003MP-scaled.jpg'
  },
];

const Notificacion = () => {
  const navigate = useNavigate(); // Instancia de useNavigate para la navegación

  const handlePagarAhora = () => {
    navigate("/pago"); // Redirige a la ruta /pago, que es donde está el componente VistaPago
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-[#061c3d] w-full max-w-[750px] h-auto max-h-[670px] overflow-y-auto rounded-xl p-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold text-[#FF9900] tracking-wider">NOTIFICACIONES</h1>
        </div>
         <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-[#f7e2c4] rounded-2xl p-6 mb-6 shadow-lg flex justify-between items-center border-b border-[#999] "
              >
                {/* Persona + texto */}
                <div className="flex items-center gap-[15px]"> 
                  <img
                    src={evento.imagenPersona}
                    alt={`Foto de ${evento.nombre}`} 
                    className="w-[90px] h-[90px] rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 max-w-[70%]">
                    <p className="text-[#061c3d]">
                    <span className="text-xl text-[#061c3d]" style={{ fontWeight: 800 }}>{evento.nombre}</span>{' '}
                      <span
                        className={
                          evento.estado === 'aprobado'
                            ? 'text-[#02AC66] font-medium'
                            : 'text-[#EF280F] font-medium'
                        }
                        style={{ fontWeight: 800 }}
                      >
                        {evento.estado === 'aprobado' ? 'aprobó' : 'rechazó'}
                      </span>{' '}
                      tu reserva
                    </p>
                    <p className="text-xl text-[#061c3d]" style={{ fontWeight: 800 }}>{evento.vehiculo}</p>
                    <p className="text-sm text-gray-700">{evento.fecha}</p>
                  </div>
                </div>

                {/* Auto + botón */}
                <div className="flex flex-col items-center">
                  <img
                    src={evento.imagenAuto}
                    alt={`Vehículo reservado: ${evento.vehiculo}`}
                    className="w-[110px] h-[90px] object-cover rounded-lg shrink-0"
                  />
                  {evento.estado === 'aprobado' && (
                    <button className="mt-2 bg-[#FF9900] text-white px-3 py-1 rounded-md hover:bg-[#cc7a00] transition">
                    Pagar ahora
                  </button>
                  
                  )}
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Notificacion;