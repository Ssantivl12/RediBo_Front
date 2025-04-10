export const API_URL = "http://localhost:4000/api";

export const getAutos = async () => {
    const response = await fetch(`${API_URL}/autos`);
    if(!response.ok) throw new Error('Error al obtener datos');
    return response.json();
};