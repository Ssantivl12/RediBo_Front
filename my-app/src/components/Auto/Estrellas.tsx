
export default function Estrellas({ promedio }: { promedio: number }) {
  const estrellas = [];

  for (let i = 1; i <= 5; i++) {
    if (promedio >= i) {
      estrellas.push(<span key={i}>★</span>); // Llena
    } else if (promedio > i - 1 && promedio < i) {
      estrellas.push(<span key={i}>⯨</span>); // Media estrella (Unicode alternativo)
    } else {
      estrellas.push(<span key={i}>☆</span>); // Vacía
    }
  }

  return <div className="text-[#fca311] text-2xl leading-none flex gap-1">{estrellas}</div>;
}


