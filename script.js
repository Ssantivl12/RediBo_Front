// Seleccionamos elementos necesarios
const carouselSlide = document.querySelector('.carousel-slide');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');

let currentSlide = 0;
const totalSlides = slides.length;

// Función para actualizar el carrusel con efecto deslizable
function updateCarousel() {
  carouselSlide.style.transform = `translateX(-${currentSlide * 100}%)`;
  updateDots();
}

// Función para cambiar de slide siguiente
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

// Función para cambiar de slide anterior
function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

// Crear indicadores dinámicamente según la cantidad de slides
function createDots() {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
  }
}

// Actualizar la clase activa en los indicadores
function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Listeners para los botones
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Inicializamos el carrusel e indicadores
createDots();
updateCarousel();

// Rotación automática cada 5 segundos
setInterval(() => {
  nextSlide();
}, 5000);