document.addEventListener("DOMContentLoaded", () => {
    (function() {
        // Выбор элемента контейнера для книг
        const bookContainer = document.querySelector(".book-container");
        const loadMoreButton = document.querySelector(".load-more-button");
        let startIndex = 0;
        const maxResults = 6;

        // Функция для загрузки и отображения книг
        async function loadBooks() {
            try {
                // Запрос книг из Google Books API
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:Business&key=AIzaSyCdn-QMlS7F2R3184SxsPsYYjEAL9jTCiw&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP! статус: ${response.status}`);
                }

                const books = await response.json();
                console.log(books);
                displayBooks(books, bookContainer);

                // Увеличиваем индекс для следующей загрузки
                startIndex += maxResults;
            } catch (error) {
                console.log(error);
            }
        }

        // Загрузка первых книг при старте
        loadBooks();

        // Обработчик для кнопки "Загрузить еще"
        loadMoreButton.addEventListener("click", async () => {
            await loadBooks();
        });

        function displayBooks(books, bookContainer) {
            // Цикл для перебора всех книг
            for (let i = 0; i < books.items.length; i++) {
                const book = books.items[i];
                const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
                const author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Неизвестный автор';
                const title = book.volumeInfo.title || 'Без названия';
                const rating = book.volumeInfo.averageRating || 'Нет рейтинга';
                const description = book.volumeInfo.description || 'Нет описания';
                const retailPrice = book.saleInfo?.retailPrice;
                const price = retailPrice ? `${retailPrice.amount} ₽` : 'Нет цены';

                // Создание элемента книги
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');

                // Создание элемента изображения книги
                const bookImageElement = document.createElement('div');
                bookImageElement.classList.add('book-image');

                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                bookImageElement.appendChild(imageElement);

                // Создание элемента информации о книге
                const bookInfoElement = document.createElement('div');
                bookInfoElement.classList.add('book-info');

                // Элемент автора
                const authorElement = document.createElement('div');
                authorElement.classList.add('book-author');
                const authorNameElement = document.createElement('h3');
                authorNameElement.textContent = author;
                authorElement.appendChild(authorNameElement);

                // Элемент заголовка
                const titleElement = document.createElement('div');
                titleElement.classList.add('book-title');
                const titleTextElement = document.createElement('p');
                titleTextElement.textContent = title;
                titleElement.appendChild(titleTextElement);

                // Элемент рейтинга
                const ratingElement = document.createElement('div');
                ratingElement.classList.add('book-rating');
                const ratingTextElement = document.createElement('p');
                ratingTextElement.textContent = `Рейтинг: ${rating}`;
                ratingElement.appendChild(ratingTextElement);

                // Элемент описания
                const descriptionElement = document.createElement('div');
                descriptionElement.classList.add('book-description');
                const descriptionTextElement = document.createElement('p');
                descriptionTextElement.textContent = description;
                descriptionElement.appendChild(descriptionTextElement);

                // Элемент цены
                const priceElement = document.createElement('div');
                priceElement.classList.add('book-price');
                const priceTextElement = document.createElement('p');
                priceTextElement.textContent = `Цена: ${price}`;
                priceElement.appendChild(priceTextElement);

                // Кнопка покупки
                const buttonElement = document.createElement('button');
                buttonElement.classList.add('button-buy');
                buttonElement.textContent = 'Купить';

                // Добавление всех элементов в структуру bookInfoElement
                bookInfoElement.appendChild(authorElement);
                bookInfoElement.appendChild(titleElement);
                bookInfoElement.appendChild(ratingElement);
                bookInfoElement.appendChild(descriptionElement);
                bookInfoElement.appendChild(priceElement);
                bookInfoElement.appendChild(buttonElement);

                // Добавление всех элементов в структуру bookElement
                bookElement.appendChild(bookImageElement);
                bookElement.appendChild(bookInfoElement);

                // Добавление элемента книги в контейнер
                bookContainer.appendChild(bookElement);
            }
        }
    })();
});