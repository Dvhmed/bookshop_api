export function setupBookstore() {
  // Находим элементы на странице
  const bookContainer = document.querySelector(".book-container");
  const loadMoreButton = document.querySelector(".load-more-button");
  const categoryLinks = document.querySelectorAll(".sidebar-category__item");
  const cartCountCircle = document.querySelector(".nav__icon_count-circle");
  const cartCountText = cartCountCircle.querySelector(".nav__icon_count-text");

  let startIndex = 0;
  const maxResults = 6;
  let currentCategory = "Architecture";

  const bookCache = {};

  // Определение SVG для звезд рейтинга
  const svgDefs = `
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="star" viewBox="0 0 32 32">
                <path d="M16 2.5l4.5 9.1 10 1.4-7.2 7 1.7 10-9-4.8-9 4.8 1.7-10-7.2-7 10-1.4z"/>
            </symbol>
        </svg>
    `;
  document.body.insertAdjacentHTML("afterbegin", svgDefs);

  // Функция для загрузки книг
  async function loadBooks(category = currentCategory) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=AIzaSyCdn-QMlS7F2R3184SxsPsYYjEAL9jTCiw&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`
      );
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! статус: ${response.status}`);
      }
      const books = await response.json();
      console.log(books); // Логируем весь объект books при загрузке книг
      displayBooks(books);
      startIndex += maxResults;
      loadMoreButton.style.display =
        startIndex >= books.totalItems ? "none" : "block";
    } catch (error) {
      console.error(error);
    }
  }

  // Обработчик события на кнопке "Загрузить ещё"
  loadMoreButton.addEventListener("click", () => {
    console.log("Кнопка 'Загрузить ещё' нажата");
    loadBooks(currentCategory);
  });

  // Обработчик кликов по категориям
  categoryLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const category = event.target.textContent.trim();
      categoryLinks.forEach((item) =>
        item.classList.remove("sidebar-category__item_active")
      );
      link.classList.add("sidebar-category__item_active");
      await onCategoryChange(category);
    });
  });

  // Функция для отображения книг
  function displayBooks(books) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    books.items.forEach((book) => {
      const { volumeInfo, saleInfo } = book;
      const imageUrl = volumeInfo.imageLinks
        ? volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/128x192.png?text=No+Cover";
      const authors = volumeInfo.authors
        ? volumeInfo.authors.join(", ")
        : "Unknown author";
      const title = volumeInfo.title || "No title";
      const bookKey = `${title}-${authors}`;
      const description = volumeInfo.description || "No description";

      let { rating, ratingCount, price, priceSource } = getBookData(
        book,
        bookKey,
        saleInfo
      );

      console.log(
        `Загружена книга: ${title} автор(ы): ${authors} цена: ${price} (${priceSource})`
      );

      const bookElement = createBookElement({
        imageUrl,
        authors,
        title,
        rating,
        ratingCount,
        description,
        price,
        priceSource,
        cartItems,
      });
      bookContainer.appendChild(bookElement);
    });
  }

  // Функция для получения данных книги
  function getBookData(book, bookKey, saleInfo) {
    if (bookCache[bookKey]) {
      return bookCache[bookKey];
    }

    const volumeInfo = book.volumeInfo;
    const rating = volumeInfo.averageRating
      ? Math.floor(volumeInfo.averageRating)
      : Math.floor(Math.random() * 5) + 1;
    const ratingCount = volumeInfo.ratingsCount
      ? volumeInfo.ratingsCount
      : Math.floor(Math.random() * 1000);
    let price, priceSource;

    if (saleInfo?.retailPrice?.amount) {
      let amount = saleInfo.retailPrice.amount;
      if (saleInfo.retailPrice.currencyCode === "EUR") {
        console.log(`Цена в EUR: ${amount}, конвертация в USD`);
        amount *= 0.92; // Пример конвертации из евро в доллары
      } else if (saleInfo.retailPrice.currencyCode === "RUB") {
        console.log(`Цена в RUB: ${amount}, конвертация в USD`);
        amount *= 0.1; // Конвертация из RUB в USD
      } else if (saleInfo.retailPrice.currencyCode === "GBP") {
        console.log(`Цена в GBP: ${amount}, конвертация в USD`);
        amount *= 1.28; // Конвертация из GBP в USD
      }
      price = amount.toFixed(2);
      // priceSource = 'API';
    } else {
      price = (Math.random() * 10).toFixed(2);
      // priceSource = 'Generated';
    }
    price = `$${price}`;

    bookCache[bookKey] = { rating, ratingCount, price, priceSource };
    return bookCache[bookKey];
  }

  // Функция для создания элемента книги
  function createBookElement({
    imageUrl,
    authors,
    title,
    rating,
    ratingCount,
    description,
    price,
    priceSource,
    cartItems,
  }) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const bookImageElement = document.createElement("div");
    bookImageElement.classList.add("book-image");
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.classList.add("book-image__image");
    imageElement.onerror = () => {
      imageElement.src =
        "https://via.placeholder.com/128x192.png?text=No+Cover";
    };
    bookImageElement.appendChild(imageElement);

    const bookInfoElement = document.createElement("div");
    bookInfoElement.classList.add("book-info");
    bookInfoElement.appendChild(createElement("h3", "book-author", authors));
    bookInfoElement.appendChild(createElement("p", "book-title", title));
    bookInfoElement.appendChild(createRatingElement(rating, ratingCount));
    bookInfoElement.appendChild(
      createElement("p", "book-description", description)
    );
    bookInfoElement.appendChild(createElement("p", "book-price", `${price}`));

    const buttonElement = createButtonElement({
      title,
      authors,
      price,
      cartItems,
    });
    bookInfoElement.appendChild(buttonElement);

    bookElement.appendChild(bookImageElement);
    bookElement.appendChild(bookInfoElement);

    return bookElement;
  }

  // Функция для создания HTML-элемента с заданным тегом, классом и текстовым содержимым
  function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.textContent = textContent;
    return element;
  }

  // Функция для создания элемента рейтинга книги
  function createRatingElement(rating, ratingCount) {
    const ratingElement = document.createElement("div");
    ratingElement.classList.add("book-rating");
    ratingElement.innerHTML =
      getStarRating(rating) +
      `<p>${ratingCount} review${ratingCount > 1 ? "s" : ""}</p>`;
    return ratingElement;
  }

  // Функция для создания кнопки "Купить"
  function createButtonElement({ title, authors, price, cartItems }) {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("button-buy");
    buttonElement.setAttribute("aria-label", "Buy now");
    const isInCart = cartItems.some(
      (item) => item.title === title && item.author === authors
    );
    buttonElement.textContent = isInCart ? "In the cart" : "Buy now";
    buttonElement.classList.toggle("button-in-cart", isInCart);

    buttonElement.addEventListener("click", () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const bookIndex = cartItems.findIndex(
        (item) => item.title === title && item.author === authors
      );
      if (bookIndex === -1) {
        cartItems.push({ title, author: authors, price });
        buttonElement.textContent = "In the cart";
        buttonElement.classList.add("button-in-cart");
      } else {
        cartItems.splice(bookIndex, 1);
        buttonElement.textContent = "Buy now";
        buttonElement.classList.remove("button-in-cart");
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartCount(cartItems.length);
    });

    return buttonElement;
  }

  // Функция для получения HTML-кода звезд рейтинга
  function getStarRating(rating) {
    const maxStars = 5;
    let starsHtml = "";
    for (let i = 1; i <= maxStars; i++) {
      starsHtml += `<svg class="star" width="12" height="12" viewBox="0 0 32 32"><use xlink:href="#star" fill="${
        i <= rating ? "#F2C94C" : "#EEEDF5"
      }"></use></svg>`;
    }
    return starsHtml;
  }

  // Функция для обновления количества товаров в корзине
  function updateCartCount(count) {
    if (count > 0) {
      cartCountCircle.style.display = "block";
      cartCountText.textContent = count.toString();
    } else {
      cartCountCircle.style.display = "none";
    }
  }

  // Начальная установка количества товаров в корзине
  const initialCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  updateCartCount(initialCartItems.length);

  // Сброс корзины при уходе со страницы
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
  });

  // Первоначальная загрузка книг
  loadBooks();

  // Обработчик смены категории
  async function onCategoryChange(newCategory) {
    currentCategory = newCategory;
    startIndex = 0;
    bookContainer.innerHTML = "";
    console.log(`Смена категории: ${newCategory}`);
    await loadBooks(newCategory);
  }
}
