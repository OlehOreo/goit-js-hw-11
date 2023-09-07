import axios from 'axios';
import Notiflix from 'notiflix';

export default async function getImages(value, currentPage = '1') {
  // Створення параметрів для запиту
  const params = new URLSearchParams({
    key: '39225656-142513377f0af9cf63747c703',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: currentPage,
  });

  return axios
    .get(`https://pixabay.com/api/?${params}`)
    .then(respons => respons.data)
    .catch(error => {
      // Notiflix.Notify.warning(
      //   "We're sorry, but you've reached the end of search results."
      // );
    });
}
