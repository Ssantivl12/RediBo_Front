import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import './index.css'; // Importa Tailwind
import VistaPago from './componentes/VistaPago'; // Importa el componente
{/*import Notificacion from './componentes/Notificacion';*/}
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> /* Asegúrate de envolver tu aplicación en un Router 
      <VistaPago/>
    </BrowserRouter>
  </React.StrictMode>
);
