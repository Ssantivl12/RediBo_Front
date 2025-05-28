"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { debounce } from "lodash";
import { FiMail, FiPhone, FiSearch, FiPlusCircle, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image"
import { BASE_URL } from "@/libs/autoServices";

interface User {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  fotoPerfil: string;
}

const UserBrowser = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const datosPaso1 = localStorage.getItem("registroDriverPaso1");
    if (datosPaso1) {
      console.log("📦 Datos del paso 1 recibidos:", JSON.parse(datosPaso1));
    } else {
      console.warn("⚠️ No se encontraron datos del paso 1 en localStorage");
    }
  
    fetch(`${BASE_URL}/api/usuarios/renters`)
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.error("Error al obtener renters:", err))
      .finally(() => setLoading(false));
  }, []);
  
  useEffect(() => {
    const stored = localStorage.getItem("selectedRenters");
    if (stored) {
      setSelectedUsers(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedRenters", JSON.stringify(selectedUsers));
  }, [selectedUsers]);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    [setSearchQuery]
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allUsers.filter(
      (user) =>
        user.nombreCompleto.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.telefono?.toString().includes(q)
    );
  }, [searchQuery, allUsers]);

  const handleAddUser = (user: User) => {
    if (!selectedUsers.find((u) => u.idUsuario === user.idUsuario)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (id: number) => {
    setSelectedUsers(selectedUsers.filter((u) => u.idUsuario !== id));
  };

  const handleRegisterDriver = async () => {
    try {
      const datosPaso1 = localStorage.getItem("registroDriverPaso1");
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      if (!datosPaso1) {
        alert("❌ No se encontraron datos del paso 1");
        return;
      }
  
      const {
        sexo,
        telefono,
        nro_licencia,
        categoria,
        fecha_emision,
        fecha_vencimiento,
        anversoUrl,
        reversoUrl,
      } = JSON.parse(datosPaso1);
  
      const res = await fetch(`${BASE_URL}/api/registro-driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,},
        credentials: "include",
        body: JSON.stringify({
          sexo,
          telefono,
          nro_licencia,
          categoria,
          fecha_emision,
          fecha_vencimiento,
          anversoUrl,
          reversoUrl,
          rentersIds: selectedUsers.map((u) => u.idUsuario),
        }),
      });
      console.log("🔴 Respuesta del backend:", res.status);
      const errorText = await res.text();
      console.log("🧾 Detalle del error:", errorText);
  
      if (!res.ok) throw new Error("Falló el registro");
      localStorage.setItem("registroExitosoDriver", "true");
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new CustomEvent('driverRegistered',{
        detail: {success: true}
      }))
  
      setSelectedUsers([]);
      localStorage.removeItem("selectedRenters");
      localStorage.removeItem("registroDriverPaso1");
      localStorage.setItem('registroDriver', '1');
      router.push("/home");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al registrar driver");
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };  
  
  const UserCard = ({
    user,
    isSelected,
    onAction,
  }: {
    user: User;
    isSelected: boolean;
    onAction: (user: User) => void;
  }) => {
    const [fallback, setFallback] = useState(false);

    const profileImageUrl =
      fallback || !user.fotoPerfil
        ? "/user-default.svg"
        : `http://localhost:3001${
            user.fotoPerfil.startsWith("/") ? "" : "/"
          }${user.fotoPerfil}`;

    return (
      <div
        className="w-65 min-h-fit px-4 py-3 m-3 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition duration-300 font-inter justify-between"
      >
        <div className="flex items-center space-x-4">
          <Image
            width={128}
            height={128}
            src={profileImageUrl}
            alt={`Foto de ${user.nombreCompleto}`}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
            onError={() => setFallback(true)}
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {user.nombreCompleto}
            </h3>
            <div className="text-sm text-gray-600 flex items-center mt-1 truncate">
              <FiMail className="mr-2 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center mt-1 truncate">
              <FiPhone className="mr-2 shrink-0" />
              <span className="truncate">{user.telefono}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => onAction(user)}
            className={`w-full py-1.5 rounded-full text-sm font-semibold transition duration-200 ${
              isSelected
                ? "bg-gray-200 text-[#505050] hover:bg-gray-300"
                : "bg-[#FFA800] text-white hover:bg-[#e29400]"
            }`}
          >
            {isSelected ? (
              <>
                <FiX className="inline mr-2" />
                Quitar
              </>
            ) : (
              <>
                <FiPlusCircle className="inline mr-2" />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    
    <div className="min-h-screen bg-white">

      {/* Contenedor principal con margen top suficiente */}
      <div className="max-w-7xl mx-auto pt-25 px-6">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">Seleccionar Renters</h1>
        
        {/* Input de búsqueda */}
        <div className="mb-8 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-200"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>


        {loading ? (
          <p className="text-center">Cargando usuarios...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No se encontraron usuarios.</p>
        ) : (
          <div className="relative mt-4">
            {/* Contenedor con flechas y carrusel */}
            <div className="flex items-center">
              
              {/* Flecha izquierda */}
              <button
                onClick={scrollLeft}
                className="w-10 h-10 flex items-center justify-center bg-[#1E3A8A] rounded-full shadow-md hover:bg-blue-800 text-white mr-2"
                aria-label="Scroll left"
              >
                ←
              </button>

              {/* Carrusel de cards */}
              <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollBehavior: "smooth", maxWidth: "calc(100% - 96px)" }}
              >
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.idUsuario}
                    user={user}
                    isSelected={selectedUsers.some(
                      (u) => u.idUsuario === user.idUsuario
                    )}
                    onAction={handleAddUser}
                  />
                ))}
              </div>

              {/* Flecha derecha */}
              <button
                onClick={scrollRight}
                className="w-10 h-10 flex items-center justify-center bg-[#1E3A8A] rounded-full shadow-md hover:bg-blue-800 text-white ml-2"
                aria-label="Scroll right"
              >
                →
              </button>
            </div>
          </div>

        )}


      {/* Tabla visual de renters seleccionados */}
      {selectedUsers.length > 0 && (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-[#1E3A8A] p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#1E3A8A] text-center">
              Renters seleccionados
            </h2>

            <table className="w-full text-sm text-[#505050] font-inter">
              <thead>
                <tr className="border-b text-left text-gray-600 font-medium">
                  <th className="py-2 px-2">Nombre</th>
                  <th className="py-2 px-2">Correo</th>
                  <th className="py-2 px-2">Teléfono</th>
                  <th className="py-2 px-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {selectedUsers.map((user) => (
                  <tr
                    key={user.idUsuario}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-2">{user.nombreCompleto}</td>
                    <td className="py-2 px-2">{user.email}</td>
                    <td className="py-2 px-2">{user.telefono}</td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleRemoveUser(user.idUsuario)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-500 transition"
                        title="Eliminar renter"
                      >
                        <FiX size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleRegisterDriver}
                className="px-6 py-2 bg-[#FFA800] text-white rounded-full text-sm font-semibold hover:bg-[#e19900] transition"
              >
                Finalizar registro
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
      
    </div>
  );
};

export default UserBrowser;
