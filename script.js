const carouselSlide = document.querySelector(".carousel-slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselDots = document.getElementById("carouselDots");

let currentSlide = 0;
let slidesData = [];

// Cargar vehículos desde el backend
async function cargarVehiculos() {
  try {
    const res = await fetch("http://localhost:3000/vehiculos");
    const data = await res.json();
    console.log("Datos recibidos:", data); // Inspecciona los datos aquí
    slidesData = data;
    renderSlides();
    createDots();
    updateCarousel();
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
}

// Renderizar los slides dinámicamente
function renderSlides() {
  console.log('slidesData:', slidesData); // Depura qué estás recibiendo
  slidesData.forEach((slide) => {
    // Tu lógica para renderizar los slides
    carouselSlide.innerHTML = ""; // Limpiar

    slidesData.forEach((vehiculo) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      slide.innerHTML = `
        <img src="${vehiculo.imageUrl}" alt="${vehiculo.model}">
        <div class="info">
          <h3 class="nombre">Nombre: ${vehiculo.model}</h3>
          <p class="modelo">Marca: ${vehiculo.brand}</p>
          <p class="precio">Precio por día: $${vehiculo.pricePerDay}</p>
          <p class="rating">Rating promedio: ${vehiculo.promedioRating.toFixed(2)}</p>
        </div>
      `;
      carouselSlide.appendChild(slide);
    });
  });
}

function updateCarousel() {
  carouselSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slidesData.length;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
  updateCarousel();
}

function createDots() {
  carouselDots.innerHTML = ""; // Limpiar
  for (let i = 0; i < slidesData.length; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentSlide = i;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
  }
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

setInterval(() => {
  nextSlide();
}, 5000);

// Iniciar todo
cargarVehiculos();