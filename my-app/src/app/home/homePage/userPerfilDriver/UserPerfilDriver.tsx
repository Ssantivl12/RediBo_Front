"use client";

import React, { useState, useEffect, useRef } from "react";
import NavbarPerfilUsuario from "@/app/components/navbar/NavbarPerfilUsuario";
import PerfilIcon from "@/app/components/Icons/Perfil";
import UserIcon from "@/app/components/Icons/User";
import PhoneIcon from "@/app/components/Icons/Phone";
import LicenciaConductorIcon from "@/app/components/Icons/LicenciaConductor";
import CategoriaIcon from "@/app/components/Icons/Categoria";
import CalendarIcon from "@/app/components/Icons/Calendar";
import PencilIcon from "@/app/components/Icons/Pencil";
import { SolarGalleryOutline } from "@/app/components/Icons/Gallery";
import { useUser } from "@/hooks/useUser";

const cloudName = "TU_CLOUD_NAME"; // ← reemplaza esto
const uploadPreset = "TU_UPLOAD_PRESET"; // ← reemplaza esto

type DriverData = {
  usuario: { nombreCompleto: string; fotoPerfil?: string };
  sexo: string;
  telefono: string;
  licencia: string;
  tipoLicencia: string;
  fechaEmision: string;
  fechaExpiracion: string;
  anversoUrl: string;
  reversoUrl: string;
};

export default function UserPerfilDriver() {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [originalData, setOriginalData] = useState<DriverData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showGallery, setShowGallery] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [loadingUpload, setLoadingUpload] = useState<"anverso" | "reverso" | null>(null);

  const user = useUser();
  const inputAnversoRef = useRef<HTMLInputElement>(null);
  const inputReversoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDriverData(data);
        setOriginalData(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchDriver();
  }, []);

  useEffect(() => {
    if (user?.fotoPerfil) setProfilePhotoUrl(user.fotoPerfil);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDriverData((prev) => (prev ? { ...prev, [name]: value } : prev));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    const campos = ["telefono", "licencia", "fechaEmision", "fechaExpiracion"];

    campos.forEach((campo) => {
      if (!driverData?.[campo as keyof DriverData]) newErrors[campo] = "Campo obligatorio";
    });

    if (!/^[67]\d{7}$/.test(driverData?.telefono || "")) {
      newErrors.telefono = "Debe tener 8 dígitos y comenzar con 6 o 7.";
    }

    if (!/^[a-zA-Z0-9]{6,}$/.test(driverData?.licencia || "")) {
      newErrors.licencia = "Debe tener al menos 6 caracteres alfanuméricos.";
    }

    if (
      driverData?.fechaEmision &&
      driverData.fechaEmision > new Date().toISOString().split("T")[0]
    ) {
      newErrors.fechaEmision = "Fecha inválida.";
    }

    if (
      driverData?.fechaEmision &&
      driverData?.fechaExpiracion &&
      new Date(driverData.fechaExpiracion) <= new Date(driverData.fechaEmision)
    ) {
      newErrors.fechaExpiracion = "Debe ser posterior a la de emisión.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelEdit = () => {
    setDriverData(originalData);
    setTouched({});
    setErrors({});
    setEditMode(false);
  };

  const handleSave = () => {
    if (validateFields()) {
      setOriginalData(driverData);
      setEditMode(false);
    }
  };

  const handleImagenLicenciaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "anverso" | "reverso"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = tempUrl;

    img.onload = async () => {
      if (img.width < 500 || img.height < 500) {
        alert("La imagen debe ser al menos de 500x500 px.");
        return;
      }

      setLoadingUpload(tipo);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.secure_url;

      setDriverData((prev) =>
        prev
          ? {
              ...prev,
              anversoUrl: tipo === "anverso" ? imageUrl : prev.anversoUrl,
              reversoUrl: tipo === "reverso" ? imageUrl : prev.reversoUrl,
            }
          : prev
      );

      setLoadingUpload(null);
    };
  };

  const renderUploadIcon = (tipo: "anverso" | "reverso") => (
    <button
      onClick={() =>
        tipo === "anverso"
          ? inputAnversoRef.current?.click()
          : inputReversoRef.current?.click()
      }
      className="absolute top-2 right-2 bg-white rounded-full p-1 border shadow hover:bg-gray-200"
      title={`Actualizar ${tipo}`}
    >
      {loadingUpload === tipo ? (
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
      ) : (
        <SolarGalleryOutline className="w-5 h-5 text-[#11295B]" />
      )}
    </button>
  );
  if (!user || !driverData) return null;

  return (
    <>
      <NavbarPerfilUsuario />
      <main className="min-h-screen bg-white text-[#11295B] px-10 py-10">
        <h1 className="text-center text-2xl font-bold mb-10">
          INFORMACIÓN PERSONAL DRIVER
        </h1>

        <main className="flex justify-center">
          <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10">
            <div className="w-full md:w-[160px] flex-shrink-0 flex flex-col items-center md:items-start">
              <div className="border-2 border-gray-300 rounded-2xl overflow-hidden w-[120px] h-[120px]">
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PerfilIcon className="w-full h-full text-gray-500 p-4" />
                )}
              </div>

              <button
                onClick={() =>
                  editMode ? handleCancelEdit() : setEditMode(true)
                }
                className="mt-4 bg-[#FFA500] hover:bg-[#e69500] text-white font-semibold py-2 px-4 rounded-full shadow"
              >
                {editMode ? "Cancelar" : "Editar perfil"}
              </button>

              {editMode && (
                <button
                  onClick={handleSave}
                  className="mt-2 bg-[#FFA500] hover:bg-[#e69500] text-white font-semibold py-2 px-4 rounded-full shadow"
                >
                  Guardar cambios
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6 w-full max-w-3xl ml-10">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="text-sm font-semibold">Nombre Completo:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={driverData.usuario.nombreCompleto}
                      readOnly
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow text-[#11295B] font-semibold bg-gray-100"
                    />
                    <UserIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  </div>
                </div>
                <div className="w-48">
                  <label className="text-sm font-semibold">Sexo</label>
                  <input
                    type="text"
                    value={driverData.sexo}
                    readOnly
                    className="w-full py-2 px-4 border-2 border-black rounded shadow text-[#11295B] font-semibold bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Teléfono</label>
                <div className="relative">
                  <input
                    type="text"
                    name="telefono"
                    value={driverData.telefono}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className={`w-full pl-10 py-2 border-2 rounded shadow font-semibold ${
                      errors.telefono && touched.telefono
                        ? "border-red-500 text-red-500"
                        : "border-black text-[#11295B]"
                    }`}
                  />
                  <PhoneIcon
                    className={`absolute left-2 top-2.5 w-5 h-5 ${
                      errors.telefono && touched.telefono
                        ? "text-red-500"
                        : "text-[#11295B]"
                    }`}
                  />
                  {editMode && (
                    <PencilIcon className="absolute right-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  )}
                </div>
                {errors.telefono && touched.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div className="flex gap-2 items-end">
                <div className="w-full">
                  <label className="text-sm font-semibold">No. de licencia de conducir</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="licencia"
                      value={driverData.licencia}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                      className={`w-full pl-10 py-2 border-2 rounded shadow font-semibold ${
                        errors.licencia && touched.licencia
                          ? "border-red-500 text-red-500"
                          : "border-black text-[#11295B]"
                      }`}
                    />
                    <LicenciaConductorIcon
                      className={`absolute left-2 top-2.5 w-5 h-5 ${
                        errors.licencia && touched.licencia
                          ? "text-red-500"
                          : "text-[#11295B]"
                      }`}
                    />
                    {editMode && (
                      <PencilIcon className="absolute right-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    )}
                  </div>
                  {errors.licencia && touched.licencia && (
                    <p className="text-red-500 text-sm mt-1">{errors.licencia}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowGallery(true)}
                  className="p-2 border-2 border-black rounded hover:bg-gray-100"
                >
                  <SolarGalleryOutline className="w-6 h-6 text-[#11295B]" />
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold">Categoría</label>
                <div className="relative">
                  {editMode ? (
                    <select
                      name="tipoLicencia"
                      value={driverData.tipoLicencia}
                      onChange={handleInputChange}
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow text-[#11295B] font-semibold appearance-none"
                    >
                      <option value="">Seleccionar</option>
                      <option value="P">Particular (P)</option>
                      <option value="Profesional A">Profesional A</option>
                      <option value="Profesional B">Profesional B</option>
                      <option value="Profesional C">Profesional C</option>
                      <option value="M">Motorista (M)</option>
                      <option value="F">Especial (F)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={driverData.tipoLicencia}
                      readOnly
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow text-[#11295B] font-semibold bg-gray-100"
                    />
                  )}
                  <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  {editMode && (
                    <PencilIcon className="absolute right-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label className="text-sm font-semibold">Fecha de emisión</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fechaEmision"
                      value={driverData.fechaEmision?.split("T")[0] || ""}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                      className={`w-full pl-10 py-2 border-2 rounded shadow font-semibold ${
                        errors.fechaEmision && touched.fechaEmision
                          ? "border-red-500 text-red-500"
                          : "border-black text-[#11295B]"
                      }`}
                    />
                    <CalendarIcon
                      className={`absolute left-2 top-2.5 w-5 h-5 ${
                        errors.fechaEmision && touched.fechaEmision
                          ? "text-red-500"
                          : "text-[#11295B]"
                      }`}
                    />
                  </div>
                  {errors.fechaEmision && touched.fechaEmision && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaEmision}</p>
                  )}
                </div>

                <div className="w-full">
                  <label className="text-sm font-semibold">Fecha de vencimiento</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="fechaExpiracion"
                      value={driverData.fechaExpiracion?.split("T")[0] || ""}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                      className={`w-full pl-10 py-2 border-2 rounded shadow font-semibold ${
                        errors.fechaExpiracion && touched.fechaExpiracion
                          ? "border-red-500 text-red-500"
                          : "border-black text-[#11295B]"
                      }`}
                    />
                    <CalendarIcon
                      className={`absolute left-2 top-2.5 w-5 h-5 ${
                        errors.fechaExpiracion && touched.fechaExpiracion
                          ? "text-red-500"
                          : "text-[#11295B]"
                      }`}
                    />
                  </div>
                  {errors.fechaExpiracion && touched.fechaExpiracion && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaExpiracion}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* INPUTS DE CARGA */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          ref={inputAnversoRef}
          onChange={(e) => handleImagenLicenciaChange(e, "anverso")}
        />
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          ref={inputReversoRef}
          onChange={(e) => handleImagenLicenciaChange(e, "reverso")}
        />

        {/* MODAL GALERÍA */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] max-w-4xl">
              <h2 className="text-xl font-bold mb-4 text-[#11295B]">Galería de Licencia</h2>
              <div className="flex justify-around gap-8 relative">
                <div className="relative group">
                  <img
                    src={driverData.anversoUrl}
                    alt="Anverso"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.anversoUrl)}
                  />
                  {editMode && renderUploadIcon("anverso")}
                </div>

                <div className="relative group">
                  <img
                    src={driverData.reversoUrl}
                    alt="Reverso"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.reversoUrl)}
                  />
                  {editMode && renderUploadIcon("reverso")}
                </div>
              </div>

              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-[#11295B] text-white rounded hover:bg-blue-900"
                  onClick={() => setShowGallery(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ZOOM */}
        {zoomUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            onClick={() => setZoomUrl(null)}
          >
            <img
              src={zoomUrl}
              alt="Imagen ampliada"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg"
            />
          </div>
        )}
      </main>
    </>
  );
}
