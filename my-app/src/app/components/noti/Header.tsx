import { BellIcon } from '@heroicons/react/24/outline';

// Definimos las props que recibe NotificationBell
interface NotificationBellProps {
  onClick: () => void; // 👈 Aquí declaramos que espera una función onClick
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="relative">
      <BellIcon className="h-7 w-7 text-[#FCA311]" />
      <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-3 w-3" />
    </button>
  );
};

export default NotificationBell;
