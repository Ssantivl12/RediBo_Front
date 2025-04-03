// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Notificacion from './componentes/Notificacion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Notificacion />
  </StrictMode>
)
