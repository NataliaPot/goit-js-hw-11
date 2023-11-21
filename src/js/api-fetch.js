import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40666285-e6d2601cf92949ca25230367b';

async function fetchImages(searchQuery, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: 40,
  });

  return await axios.get(`${BASE_URL}?${params}`);
}

export { fetchImages };
