
export default function Estrellas({ promedio }: { promedio: number }) {
  const estrellas = [];

  for (let i = 1; i <= 5; i++) {
    if (promedio >= i) {
      estrellas.push(<span key={i}>★</span>);
    } else if (promedio >= i - 0.5) {
      estrellas.push(
        <span key={i} style={{ position: 'relative', display: 'inline-block', width: '1em' }}>
          <span style={{ color: '#fca311', position: 'absolute', width: '50%', overflow: 'hidden' }}>★</span>
          <span style={{ color: '#e0e0e0' }}>★</span>
        </span>
      );
    } else {
      estrellas.push(<span key={i}>☆</span>);
    }
  }

  return <div className="text-[#fca311] text-2xl leading-none flex gap-1">{estrellas}</div>;
}

