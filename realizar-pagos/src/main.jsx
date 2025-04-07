

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Importa Tailwind
import Notificacion from './componentes/Notificacion';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Notificacion />
  </React.StrictMode>
);