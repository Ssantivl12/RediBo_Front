// src/componentes/Notificacion.jsx
import { useState } from 'react'
import reactLogo from '../assets/react.svg'         // Asegúrate de que el archivo exista aquí
import viteLogo from '/vite.svg'
//import '../../App.css'                              // Asegúrate de que App.css esté en src/
import '../App.css'
function Notificacion() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.infobae.com/autos/2021/09/08/autos-de-carrera-100-electricos-empieza-la-busqueda-para-seducir-a-los-amantes-de-la-competicion/" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo fefe" alt="React logo" />
        </a>
      </div>
      <h1>Diego</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count - 2)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/componentes/Notificacion.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default Notificacion
