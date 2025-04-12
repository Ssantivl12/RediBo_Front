const carouselSlide = document.querySelector('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let slides = [];
let autoPlayInterval;

async function loadVehicles() {
  try {
    const response = await fetch('http://localhost:3000/vehiculos');
    const data = await response.json();
    initCarousel(data);
    createDots(data.length);
    startAutoPlay();
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
}

function initCarousel(vehicles) {
  carouselSlide.innerHTML = vehicles.map((vehicle, index) => `
    <div class="slide ${index === 0 ? 'center' : ''}" data-index="${index}">
      <img src="${vehicle.imageUrl}" alt="${vehicle.model}">
      <div class="info">
        <h3 class="nombre">Modelo: ${vehicle.model}</h3>
        <p class="modelo">Marca: ${vehicle.brand}</p>
        <p class="precio">Precio por día: $${vehicle.pricePerDay}/día</p>
        <p class="rating">Rating promedio: ${vehicle.promedioRating.toFixed(2)}</p>
      </div>
    </div>
  `).join('');

  slides = document.querySelectorAll('.slide');
  updateSlidesPosition();
}

function updateSlidesPosition() {
  const totalSlides = slides.length;
  
  slides.forEach((slide, index) => {
    const position = (index - currentIndex + totalSlides) % totalSlides;
    
    slide.classList.remove('left', 'center', 'right', 'active');
    
    if (position === 0) {
      slide.classList.add('center', 'active');
    } else if (position === 1) {
      slide.classList.add('right');
    } else if (position === totalSlides - 1) {
      slide.classList.add('left');
    } else {
      slide.style.opacity = '0';
      slide.style.zIndex = '0';
      return;
    }
    
    slide.style.opacity = '1';
    slide.style.zIndex = position === 0 ? '3' : '1';
  });
}

function createDots(total) {
  dotsContainer.innerHTML = Array.from({length: total}, (_, i) => `
    <div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
  `).join('');

  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.dataset.index);
      updateSlidesPosition();
      updateDots();
    });
  });
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidesPosition();
    updateDots();
  }, 10000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlidesPosition();
  updateDots();
  resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlidesPosition();
  updateDots();
  resetAutoPlay();
});

// Inicialización
loadVehicles();