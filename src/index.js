import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// js файли
import getImages from './js/pixabay-api';
import createMarkup from './js/create-markup';

// // Загальні налаштування сповіщень Notifix

Notiflix.Notify.init({
  width: '600px',
  position: 'right-top',
  fontSize: '20px',
  distance: '10px',
  timeout: 3000,
  opacity: 1,
  clickToClose: true,
  textColor: '#fff',
});
// Створюю екземпляр класу SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
});

// Створюю змінні
const maxImagesPerPage = 40;
let page;
let totalPages;
let amountOfImages = 0;
let query = '';

const elements = {
  form: document.querySelector('#search-form'),
  galery: document.querySelector('.js-gallery'),
  loadBtn: document.querySelector('.js-load-more'),
};
const options = {
  root: null,
  rootMargin: '200px',
  // threshold: 1,
};

// Спостерігає за входженнями елемента у вюпорт
const observer = new IntersectionObserver(checkScrollPosition, options);

// Додаю слухач подій
elements.form.addEventListener('submit', handlerSearch);
elements.loadBtn.addEventListener('click', handlerLoadMore);

async function handlerSearch(evt) {
  evt.preventDefault();
  // Записую у змінну запит пошуку введений у інпут
  query = evt.currentTarget.elements.searchQuery.value;

  // Перевірка щоб користувач не відправив пусте поле
  if (query === '') {
    Notiflix.Notify.failure('Please enter a value in the field.');
    return;
  }
  Notiflix.Loading.standard();

  // При кожному новому пошуку скидується значення сторінки до 1
  page = 1;
  // Пири кожному новому пошуку очищується сторінка
  elements.galery.innerHTML = '';
  // Приховую кнопку load-more
  elements.loadBtn.classList.replace('load-more', 'load-more-hidden');

  try {
    //Виклик функції з запитом на api
    const { hits, totalHits } = await getImages(query, page);
    Notiflix.Loading.remove();
    //Визначаю загальну кількість сторінок
    totalPages = totalHits / maxImagesPerPage;

    // Валідація інпута
    inputValidation(hits, totalHits);

    // Розмітка фото на сторінку
    elements.galery.innerHTML = createMarkup(hits);

    // Умова для показу кнопки load-more
    if (page < totalHits) {
      elements.loadBtn.classList.replace('load-more-hidden', 'load-more');
    }
    // Стежить за входженням у вюпорт кнопки
    observer.observe(elements.loadBtn);

    // Оновлення вмісту лайтбокса
    lightbox.refresh();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong, please reload page.');
  }
}

// Клік на кнопку load-more
async function handlerLoadMore() {
  page += 1;

  // При кліку на кнопку робимо запит на ipi
  getImages(query, page)
    .then(data => {
      elements.galery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

      // Після додавання нових фото оновлюєм лайтбокс
      lightbox.refresh();

      // Плавне прокручування
      const { height: cardHeight } = document
        .querySelector('.js-gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 1.8,
        behavior: 'smooth',
      });
      checkScrollPosition(page);

      // Умова при якій кнопка load-more ховається
      if (page >= totalPages) {
        //obserer перестає слідкувати за кнопкою
        observer.unobserve(elements.loadBtn);
      }
    })
    .catch(err => console.log(err));
}

// Валідація інпута
function inputValidation(arrPhoto, quantityPhoto) {
  if (arrPhoto.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (quantityPhoto < maxImagesPerPage) {
    Notiflix.Notify.warning(`We found only ${quantityPhoto} pictures`);
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${quantityPhoto} images`);
  }
}
// Визначаєпосизцію кнопки
function checkScrollPosition(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (page < totalPages) {
        elements.loadBtn.classList.replace('load-more-hidden', 'load-more');
      } else if (page > 1 && page >= totalPages) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        elements.loadBtn.classList.replace('load-more', 'load-more-hidden');
      }
    }
  });
}
