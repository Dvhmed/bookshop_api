export const setupCarousel = () => {
  let index = 0;
  const imgElements = document.querySelectorAll(".slider-image");
  const points = Array.from(document.querySelectorAll(".points circle"));

  const updateCarousel = () => {
    points.forEach((point) => point.classList.remove("point_active"));
    imgElements.forEach((img) => img.style.display = 'none');
    imgElements[index].style.display = 'block'; // Показываем текущее изображение
    points[index].classList.add("point_active");
    index = (index + 1) % imgElements.length;
  };

  const startCarousel = () => {
    setInterval(updateCarousel, 5000);
  };

  const pointClick = (event) => {
    points.forEach((point) => point.classList.remove("point_active"));
    event.target.classList.add("point_active");
    index = points.indexOf(event.target);
    updateCarousel();
  };

  points.forEach((point) => point.addEventListener("click", pointClick));

  // Initialize the carousel
  imgElements.forEach((img, idx) => {
    img.style.display = idx === 0 ? 'block' : 'none'; // Показываем только первое изображение
  });
  updateCarousel();
  startCarousel();
};