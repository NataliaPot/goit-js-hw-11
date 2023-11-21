import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api-fetch';

const searchFormEl = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

loadMoreBtn.addEventListener('click', loadMoreImages);
searchFormEl.addEventListener('submit', onSearch);

let searchQuery = '';
let page = 1;
const perPage = 40;
let totalHits = 0;
let newData = '';
let isFirstSearch = true;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 50,
});

async function onSearch(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  searchQuery = event.currentTarget.searchQuery.value.trim();

  if (!searchQuery) {
    return Notiflix.Notify.failure('Please enter your search query');
  }

  page = 1;
  loadMoreBtn.classList.add('hidden');
  isFirstSearch = true;
  await loadMoreImages();
  event.target.reset();
}

async function loadMoreImages() {
  try {
    const { data } = await fetchImages(searchQuery, page);
    newData = data;
    page += 1;
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Try reloading the page.'
    );
  }

  totalHits = newData.totalHits;
  if (!newData.hits.length)
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

  if (isFirstSearch) {
    isFirstSearch = false;
    galleryEl.innerHTML = '';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  loadMoreBtn.classList.remove('hidden');
  appendImagesMarkup(newData.hits);
  lightbox.refresh();

  if (newData.hits.length < perPage) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.classList.add('hidden');
  }
}

function appendImagesMarkup(images) {
  const markup = createImageCardsMarkup(images);
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function createImageCardsMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
          <a href="${largeImageURL}" data-caption="${tags}" data-source="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
          </a>
          <div class="info">
            <div class="info-item"><b>Likes:</b> ${likes}</div>
            <div class="info-item"><b>Views:</b> ${views}</div>
            <div class="info-item"><b>Comments:</b> ${comments}</div>
            <div class="info-item"><b>Downloads:</b> ${downloads}</div>
          </div>
        </div>`
    )
    .join('');
}
