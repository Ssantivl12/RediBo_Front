import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';
import AutoCard from '@/components/Auto/AutoCard';

export default async function AutosPage() {
  const { data: autos } = await getAutos();

  return (
    <div className="p-5 bg-white rounded-xl">
      <h1 className="text-center text-[#11295B] text-[36px] mb-[30px]">Lista de Autos</h1>

      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {autos.map((auto: Auto) => (
          <AutoCard key={auto.id} auto={auto} />
        ))}
      </div>
    </div>
  );
}
