// libs/userService.ts
import { BASE_URL } from "@/libs/autoServices";

export const updateUserField = async (campo: string, valor: string) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${BASE_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ campo, valor }),
    });
  
    if (!res.ok) {
      throw new Error("Error al actualizar el campo");
    }
  
    return res.json();
  };

  export const uploadProfilePhoto = async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('foto_perfil', file); // el mismo nombre que usa multer 👈
  
    const res = await fetch(`${BASE_URL}/api/upload-profile-photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al subir la foto');
    }
  
    return res.json(); // va a traer { message, foto_perfil }
  };

  export const deleteProfilePhoto = async () => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(`${BASE_URL}/api/delete-profile-photo`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar la foto');
    }
  
    return res.json(); // { message }
  };

  