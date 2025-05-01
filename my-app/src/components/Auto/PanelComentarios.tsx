'use client';
import { Comentario } from '@/types/auto';
import Estrellas from './Estrellas';
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

interface PanelComentariosProps {
  mostrar: boolean;
  onClose: () => void;
  comentarios: Comentario[];
  marca: string;
  modelo: string;
}

export default function PanelComentarios({ mostrar, onClose, comentarios, marca, modelo }: PanelComentariosProps) {
  const [comentariosExpandidos, setComentariosExpandidos] = useState<Record<number, boolean>>({});
  const refsComentarios = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [comentariosConOverflow, setComentariosConOverflow] = useState<Record<number, boolean>>({});

  const promedioCalificacion = (() => {
    const filtrados = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '');
    const suma = filtrados.reduce((acc, c) => acc + c.calificacion, 0);
    return filtrados.length ? parseFloat((suma / filtrados.length).toFixed(1)) : 0;
  })();

  const criterioTexto =
    promedioCalificacion >= 4.5 ? 'Muy bueno' :
    promedioCalificacion >= 3.5 ? 'Bueno' :
    promedioCalificacion >= 2.5 ? 'Regular' :
    promedioCalificacion >= 1.5 ? 'Malo' :
    'Sin calificación';

  const distribucionEstrellas = (() => {
    const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const filtrados = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '');
    filtrados.forEach(c => conteo[c.calificacion as 1 | 2 | 3 | 4 | 5]++);
    const total = filtrados.length;
    const porcentajes = Object.fromEntries(
      Object.entries(conteo).map(([estrella, cantidad]) => [
        estrella,
        total ? Math.round((cantidad / total) * 100) : 0,
      ])
    );
    return { conteo, porcentajes };
  })();

  useEffect(() => {
    document.body.style.overflow = mostrar ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mostrar]);

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
    return () => { observers.forEach((o) => o.disconnect()); };
  }, [comentarios]);

  const toggleExpansion = (id: number) =>
    setComentariosExpandidos(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      {mostrar && <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[90%] md:w-[600px] bg-white p-4 z-[1000] overflow-y-auto border-l-4 border-black rounded-tl-2xl rounded-bl-2xl shadow-lg transition-transform duration-300 ${mostrar ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="absolute top-6 right-4 bg-[#fca311] text-white text-lg px-3 py-1 rounded border border-black" onClick={onClose}>✕</button>
        
        <h2 className="text-2xl font-bold text-black mb-2">{marca} - {modelo}</h2>
        <hr className="border-t-4 border-black mb-3" />
        
        <div className="flex gap-4 items-center mb-4">
          <div className="bg-[#002a5c] text-white text-xl p-2 rounded w-12 text-center">
            {promedioCalificacion.toFixed(1)}
          </div>
          <Estrellas promedio={promedioCalificacion} />
          <div className="text-black font-bold">{criterioTexto}</div>
        </div>

        {([5, 4, 3, 2, 1] as const).map((estrella) => (
          <div key={estrella} className="flex items-center gap-2 mb-1">
            <div className="bg-[#002a5c] text-white w-8 h-8 flex items-center justify-center rounded">{estrella}</div>
            <div className="flex-1 h-3 bg-gray-200 rounded">
              <div
                className="h-3 bg-[#002a5c] rounded"
                style={{ width: `${distribucionEstrellas.porcentajes[estrella]}%` }}
              />
            </div>
            <span className="text-sm text-black">
              {distribucionEstrellas.porcentajes[estrella]}% ({distribucionEstrellas.conteo[estrella]})
            </span>
          </div>
        ))}
        
        <h3 className="text-xl mt-4 mb-2 text-black font-semibold">Comentarios</h3>
        <div className="space-y-4">
          {comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '').map((comentario) => {
            const fecha = new Date(comentario.fechaCreacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            const estaExpandido = comentariosExpandidos[comentario.id] ?? false;
            const estrellasLlenas = Math.floor(comentario.calificacion);
            const estrellasVacias = 5 - estrellasLlenas;

            return (
              <div key={comentario.id} className="border-b border-black pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <Image src="/imagenesIconos/usuario.png" alt="Usuario" className="w-10 h-10 rounded-full" width={50} height={50} unoptimized />
                  <div>
                    <strong className="text-black font-semibold">{comentario.usuario.nombre} {comentario.usuario.apellido}</strong>
                    <div className="text-sm text-gray-500">{fecha}</div>
                  </div>
                </div>
                <div className="text-[#fca311] flex mb-1">
                  {[...Array(estrellasLlenas)].map((_, i) => <span key={i}>★</span>)}
                  {[...Array(estrellasVacias)].map((_, i) => <span key={i}>☆</span>)}
                </div>
                <p
                  ref={(el) => { refsComentarios.current[comentario.id] = el; }}
                  className={`${!estaExpandido ? 'line-clamp-3' : ''} text-black`}
                >
                  {comentario.contenido}
                </p>
                {(comentariosConOverflow[comentario.id] || estaExpandido) && (
                  <button
                    onClick={() => toggleExpansion(comentario.id)}
                    className="text-blue-800 hover:underline text-sm mt-1"
                  >
                    {estaExpandido ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
