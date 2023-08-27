import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';

const elements = {
  select: document.querySelector('.breed-select'),
  divCatInf: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
};

// Загальні налаштування сповіщень Notifix

Notiflix.Notify.init({
  width: '600px',
  position: 'center-top',
  fontSize: '20px',
  distance: '10px',
  timeout: 6000,
  opacity: 1,
  clickToClose: true,
  textColor: '#fff',
});

// Зберігає значення для перевикористання у функціях
let breedInf = [];

// Функція наповнює селект породами котів
async function addSelectOption() {
  loadingElements(true);

  try {
    //   Запис в змінну проміса порід
    const data = await fetchBreeds();

    // завантаження інформації
    loadingElements(false);

    breedInf = data;

    // Розмітка опцій
    elements.select.innerHTML =
      '<option value="" data-placeholder="true"></option>';
    elements.select.innerHTML += data
      .map(({ name, id }) => {
        return `<option value="${id}">${name}</option>`;
      })
      .join('');

    // Кастомний селект
    new SlimSelect({
      select: elements.select,
      settings: {
        placeholderText: 'Choose a cat breed',
      },
    });
  } catch (error) {
    // Виклик функції при помилці
    isError(error);
  }
}

addSelectOption();

// Подія change на селекті

elements.select.addEventListener('change', selectBreeds);

// ІНФОРМАЦІЯ ПРО КОТА
function selectBreeds(evt) {
  // Завантаження інформації
  loadingElements(true);

  const selectedCat = evt.currentTarget.value;
  const descrBreeds = breedInf.find(cat => cat.id === selectedCat);
  const breedsId = descrBreeds.id;

  // Завантаження даних про кота
  fetchCatByBreed(breedsId)
    .then(data => {
      loadingElements(false);

      const infoAboutCat = data[0].breeds[0];
      const image = data[0].url;

      // розмітка сторінки даними про кота
      createMarkupCat(infoAboutCat, image);
    })
    .catch(error => {
      isError();
    });

  // Функція створення розмітки опису вибраного кота
  function createMarkupCat({ name, description, temperament }, img) {
    try {
      elements.divCatInf.innerHTML = ` 
    <div class="thumb">
    <img src="${img}" alt="${name}" class="img"/> </div>
      <div class="container">
        <h2 class="heading">${name}</h2>
        <p class="text">${description}</p>
         <p class="text"><span class="bold-text">Temperament:</span>
        <span>${temperament}.</span></p>
      </div>`;
    } catch (error) {
      console.log(error);
    }
  }
}

// ОПРАЦЮВАННЯ СТАНУ ЗАВАНТАЖЕННЯ

function loadingElements(loading) {
  if (loading) {
    elements.divCatInf.classList.add('visually-hidden');
    elements.loader.style.display = 'inline-block';
  } else {
    elements.divCatInf.classList.remove('visually-hidden');
    elements.loader.style.display = 'none';
  }
}

// Функція при помилці приховує елементи і виводить помилку
function isError(error) {
  console.log(error);
  elements.divCatInf.style.display = 'none';
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}
