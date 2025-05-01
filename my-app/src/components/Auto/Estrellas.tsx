import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Estrellas({ promedio }: { promedio: number }) {
  const estrellas = [];

  for (let i = 1; i <= 5; i++) {
    if (promedio >= i) {
      estrellas.push(<FaStar key={i} color="#FFD700" />);
    } else if (promedio >= i - 0.5) {
      estrellas.push(<FaStarHalfAlt key={i} color="#FFD700" />);
    } else {
      estrellas.push(<FaRegStar key={i} color="#FFD700" />);
    }
  }

  return <div className="flex flex-row">{estrellas}</div>;
}
