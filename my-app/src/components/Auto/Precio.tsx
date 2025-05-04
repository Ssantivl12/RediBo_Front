
interface Props {
  precioPorDia: string;
  dias?: number;
}

export default function Precio({ precioPorDia, dias = 5 }: Props) {
  const precioUSD = parseFloat(precioPorDia);
  const precioBOB = precioUSD * 6.89;
  const totalBOB = precioBOB * dias;

  return (
    <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
      <h3 className="text-[#11295b] font-semibold text-lg mb-4">Desglose del precio</h3>
      <div className="flex justify-between">
        <span className="font-normal text-black">Precio por día:</span>
        <span className="font-normal text-black">{precioUSD} USD</span>
      </div>
      <div className="font-normal text-black text-right mt-1">{precioBOB.toFixed(2)} BOB</div>
      <div className="flex justify-between mt-4">
        <span className="font-normal text-black">Precio total:</span>
        <span className="font-normal text-black">{totalBOB.toFixed(2)} BOB</span>
      </div>
    </div>
  );
}
