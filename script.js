// script.js
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    let slides = [];
    let currentIndex = 0;
    const autoRotateTime = 4000; // 4 segundos
  
    // Datos de ejemplo con imágenes en la carpeta "images"
    slides = [
      { imageUrl: "images/auto1.jpg", name: "Modelo A", brand: "Marca X", averagePrice: 50, availableUnits: 3 },
      { imageUrl: "images/auto2.jpg", name: "Modelo B", brand: "Marca Y", averagePrice: 60, availableUnits: 2 },
      { imageUrl: "images/auto3.jpg", name: "Modelo C", brand: "Marca Z", averagePrice: 70, availableUnits: 5 },
      { imageUrl: "images/auto4.jpg", name: "Modelo D", brand: "Marca W", averagePrice: 80, availableUnits: 1 },
      { imageUrl: "images/auto5.jpg", name: "Modelo E", brand: "Marca V", averagePrice: 90, availableUnits: 4 }
    ];
  
    renderSlides();
    startAutoRotate();
  
    function renderSlides() {
      carousel.innerHTML = '';
      slides.forEach(car => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
          <img src="${car.imageUrl}" alt="${car.name}">
          <div class="carousel-info">
            <h3>${car.name} - ${car.brand}</h3>
            <p>Precio Promedio: $${car.averagePrice}</p>
            <p>Unidades Disponibles: ${car.availableUnits}</p>
            <a href="/busqueda?modelo=${encodeURIComponent(car.name)}" class="btn">Ver detalles</a>
          </div>
        `;
        carousel.appendChild(slide);
      });
    }
  
    function updateCarousel() {
      const offset = -currentIndex * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
  
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }
  
    prevButton.addEventListener('click', () => {
      prevSlide();
      resetAutoRotate();
    });
  
    nextButton.addEventListener('click', () => {
      nextSlide();
      resetAutoRotate();
    });
  
    let autoRotateInterval;
    function startAutoRotate() {
      autoRotateInterval = setInterval(nextSlide, autoRotateTime);
    }
  
    function resetAutoRotate() {
      clearInterval(autoRotateInterval);
      startAutoRotate();
    }
  });  