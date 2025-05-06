interface Props {
    precioPorDia: string;
    dias?: number;
  }
  
  export default function Precio({ precioPorDia, dias = 5 }: Props) {
    // Convertir a número y calcular
    const precioBOB = parseFloat(precioPorDia);
    const precioUSD = precioBOB / 6.89;
    const totalBOB = precioBOB * dias;
  
    // Valor estático de garantía (500 BOB ≈ 72.57 USD)
    const garantiaBOB = 500;
    const garantiaUSD = garantiaBOB / 6.89;
  
    return (
      <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
        <h3 className="text-[#11295b] font-semibold text-lg mb-4">Desglose del precio</h3>
        
        {/* Precio por día - BOB primero */}
        <div className="flex justify-between">
          <span className="font-normal text-black">Precio por día:</span>
          <span className="font-normal text-black">{precioBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{precioUSD.toFixed(2)} USD</div>
        
        {/* Garantía */}
        <div className="flex justify-between mt-3">
          <span className="font-normal text-black">Garantía:</span>
          <span className="font-normal text-black">{garantiaBOB.toFixed(2)} BOB</span>
        </div>
        <div className="font-normal text-black text-right mt-1">{garantiaUSD.toFixed(2)} USD</div>
        
        {/* Precio total */}
        <div className="flex justify-between mt-4">
          <span className="font-normal text-black">Precio total:</span>
          <span className="font-normal text-black">{totalBOB.toFixed(2)} BOB</span>
        </div>
      </div>
    );
  }
  