const carouselSlide = document.querySelector(".carousel-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselDots = document.getElementById("carouselDots");

let currentSlide = 0;
let slidesData = [];

// Cargar los datos de las imágenes (ejemplo con una API)
async function cargarVehiculos() {
  try {
    const res = await fetch("http://localhost:3000/vehiculos");
    slidesData = await res.json();
    updateSlides(); // Actualiza las slides al cargar
    createDots(); // Crea los puntos de navegación
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
}

// Actualizar el contenido de las tres slides
function updateSlides() {
  const totalSlides = slidesData.length;
  const leftIndex = (currentSlide - 1 + totalSlides) % totalSlides; // Índice de la slide izquierda
  const centerIndex = currentSlide; // Índice de la slide central (activa)
  const rightIndex = (currentSlide + 1) % totalSlides; // Índice de la slide derecha

  const leftSlide = document.querySelector('.slide.left');
  const centerSlide = document.querySelector('.slide.center');
  const rightSlide = document.querySelector('.slide.right');

  updateSlideContent(leftSlide, slidesData[leftIndex]);
  updateSlideContent(centerSlide, slidesData[centerIndex]);
  updateSlideContent(rightSlide, slidesData[rightIndex]);

  updateDots(); // Actualiza los puntos de navegación
}

// Actualizar el contenido de una slide específica
function updateSlideContent(slideElement, data) {
  slideElement.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.model}">
    <div class="info">
      <h3 class="nombre">Nombre: ${data.model}</h3>
      <p class="modelo">Marca: ${data.brand}</p>
      <p class="precio">Precio por día: $${data.pricePerDay}</p>
      <p class="rating">Rating promedio: ${data.promedioRating.toFixed(2)}</p>
    </div>
  `;
}

// Mover al siguiente slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % slidesData.length;
  updateSlides();
}

// Mover al slide anterior
function prevSlide() {
  currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
  updateSlides();
}

// Crear los puntos de navegación
function createDots() {
  const carouselDots = document.getElementById('carouselDots');
  carouselDots.innerHTML = "";
  slidesData.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentSlide = i;
      updateSlides();
    });
    carouselDots.appendChild(dot);
  });
}

// Actualizar los puntos de navegación
function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

// Configurar eventos para los botones
document.getElementById("nextBtn").addEventListener("click", nextSlide);
document.getElementById("prevBtn").addEventListener("click", prevSlide);

// Auto-play cada 5 segundos
setInterval(nextSlide, 5000);

// Iniciar el carrusel
cargarVehiculos();