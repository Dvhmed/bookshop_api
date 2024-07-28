export const setupCarousel = () => {
  const slideImages = [
      {
          img: "../src/img/banner 1.svg",
      },
      {
          img: "../src/img/banner 2.png",
      },
      {
          img: "../src/img/banner 3.png",
      },
  ];

  let index = 0;
  const img = document.querySelector(".slider-image");
  const pointOne = document.querySelector(".point-one");
  const pointTwo = document.querySelector(".point-two");
  const pointThree = document.querySelector(".point-three");
  const points = [pointOne, pointTwo, pointThree];

  const updateCarousel = () => {
      points.forEach((point) => point.classList.remove("point_active"));
      img.src = slideImages[index].img;
      points[index].classList.add("point_active");
      index = (index + 1) % slideImages.length;
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

  pointOne.addEventListener("click", pointClick);
  pointTwo.addEventListener("click", pointClick);
  pointThree.addEventListener("click", pointClick);

  // Initialize the carousel
  updateCarousel();
  startCarousel();
};