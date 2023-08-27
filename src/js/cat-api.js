import axios from 'axios';

const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_ftiSi2Qho5LupLZIRxq5gRzcKf8ZvbE0lwpv50a5jtmZ7vHebCsqh21AxE8IjC1T';

const headers = {
  'x-api-key': API_KEY,
};

export function fetchBreeds() {
  return axios
    .get(`${BASE_URL}/breeds`, headers)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
    });
}

// Функція повертає проміс з даними про кота

export function fetchCatByBreed(breedId) {
  return axios
    .get(`${BASE_URL}/images/search?breed_ids=${breedId}`, { headers })
    .then(response => response.data);
}
