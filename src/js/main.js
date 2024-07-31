import { setupCarousel } from "./carousel";
import { setupScrollHandler } from "./scrollHandler";
import { setupBookstore } from "./bookstore"; // Ваш модуль для книг

document.addEventListener("DOMContentLoaded", () => {
  setupCarousel();
  setupScrollHandler();
  setupBookstore();
});
