import NavbarDetalle from '@/components/navbar/NavbarDetalle';
import React from 'react';

export default function Page() {

  return (
    <div className="bg-gray-50 min-h-screen">
        <NavbarDetalle/>

        <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6 text-center text-black">Términos y Condiciones</h1>

        {/* Índice */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Índice</h2>
            <ul className="list-disc list-inside space-y-2 text-blue-600">
            <li><a href="#a">A. Introducción</a></li>
            <li><a href="#b">B. Registro y Cuenta del Usuario</a></li>
            <li><a href="#c">C. Proceso de Reserva</a></li>
            <li><a href="#d">D. Política de Cancelaciones y Reembolsos</a></li>
            <li><a href="#e">E. Requisitos para los Conductores</a></li>
            <li><a href="#f">F. Seguro y Cobertura</a></li>
            <li><a href="#g">G. Responsabilidad del Usuario</a></li>
            <li><a href="#h">H. Propiedad Intelectual</a></li>
            <li><a href="#i">I. Privacidad y Protección de Datos</a></li>
            <li><a href="#j">J. Ley Aplicable y Jurisdicción</a></li>
            </ul>
        </div>

        {/* Secciones */}
        <section id="a" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">A. Introducción</h2>
            <p className="text-gray-700">
            Bienvenido a REDIBO, una plataforma de alquiler de autos que opera exclusivamente en Bolivia.
            Al utilizar nuestro sitio web, usted acepta estos términos y condiciones en su totalidad.
            Si no está de acuerdo con alguna parte, no debe usar nuestros servicios.
            </p>
        </section>

        <section id="b" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">B. Registro y Cuenta del Usuario</h2>
            <p className="text-gray-700">
            Los usuarios deben registrarse proporcionando información veraz y actualizada.
            Usted es responsable de mantener la confidencialidad de sus credenciales y acepta notificarnos
            de inmediato sobre cualquier uso no autorizado de su cuenta.
            </p>
        </section>

        <section id="c" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">C. Proceso de Reserva</h2>
            <p className="text-gray-700">
            Al realizar una reserva a través de REDIBO, usted acepta las condiciones específicas del alquiler,
            incluyendo el precio mostrado en dólares y la política de combustible y kilometraje.
            </p>
        </section>

        <section id="d" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">D. Política de Cancelaciones y Reembolsos</h2>
            <p className="text-gray-700">
            Las cancelaciones deben realizarse con al menos 48 horas de antelación para obtener un reembolso completo.
            Las cancelaciones tardías pueden estar sujetas a cargos según la política de cada proveedor.
            </p>
        </section>

        <section id="e" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">E. Requisitos para los Conductores</h2>
            <p className="text-gray-700">
            El conductor debe tener al menos 21 años y presentar una licencia válida. 
            Se requiere documento de identidad y tarjeta de crédito al recoger el vehículo.
            El cliente es responsable de cumplir con las leyes de conducción en Bolivia.
            </p>
        </section>

        <section id="f" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">F. Seguro y Cobertura</h2>
            <p className="text-gray-700">
            Todas las reservas incluyen seguro básico. Coberturas adicionales pueden adquirirse por un costo extra.
            Daños causados por negligencia o uso indebido no están cubiertos.
            </p>
        </section>

        <section id="g" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">G. Responsabilidad del Usuario</h2>
            <p className="text-gray-700">
            El usuario es responsable del uso adecuado del vehículo, de pagar multas y daños, 
            y de devolverlo en la fecha y condiciones acordadas.
            </p>
        </section>

        <section id="h" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">H. Propiedad Intelectual</h2>
            <p className="text-gray-700">
            Todo el contenido del sitio web es propiedad de REDIBO o sus licenciantes.
            Se prohíbe la reproducción o uso no autorizado del contenido sin permiso.
            </p>
        </section>

        <section id="i" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">I. Privacidad y Protección de Datos</h2>
            <p className="text-gray-700">
            REDIBO procesa datos personales según la ley boliviana. 
            Los usuarios pueden solicitar acceso, rectificación o eliminación de sus datos personales en cualquier momento.
            </p>
        </section>

        <section id="j" className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-black">J. Ley Aplicable y Jurisdicción</h2>
            <p className="text-gray-700">
            Estos términos se rigen por las leyes de Bolivia. 
            Las disputas serán resueltas en los tribunales de Santa Cruz de la Sierra.
            </p>
        </section>
        </div>
    </div>
  );
}
