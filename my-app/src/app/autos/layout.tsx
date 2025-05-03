export default function AutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 bg-white rounded-xl">
      <h1 className="text-center text-[#11295B] text-[28px] sm:text-[36px] mb-[30px] font-bold">
        Lista de Autos
      </h1>
      {children}
    </div>
  );
}