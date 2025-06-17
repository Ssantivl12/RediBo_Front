export interface Comentario {
  id: number;
  autor: string;
  texto: string;
  fecha?: string;
  avatar?: string;
  calificacion: number;
}

export interface Inquilino {
  id: number;
  nombre: string;
  img: string;
  promedio: number;
  totalReseñas: number;
  comentarios: Comentario[];
}

export const inquilinos: Inquilino[] = [
  {
    id: 1,
    nombre: "Mariza Ramirez",
    img: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.jpg?s=612x612&w=0&k=20&c=T0R-pAmJJpErWc8hE0jSJnmptUFQ5MvtPX7NPJJln9s=",
    promedio: 4.9,
    totalReseñas: 3,
    comentarios: [
      {
        id: 1,
        autor: "Jorge Suarez",
        texto: "Todo bien con Mariza.",
        fecha: "10/06/25",
        avatar: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
        calificacion: 5
      }
    ]
  },
  // ... el resto de tus inquilinos
];
