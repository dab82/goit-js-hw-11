import './sass/main.scss';
import './js/scroll-up';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import ImagesAPIService from './js/img-http-service';
import { hideLoadMoreBtn, showLoadMoreBtn, imagesMarkup } from './js/img-markup';

const PER_PAGE = 40;
const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreButton: document.querySelector('.load-more'),
  imagesContainer: document.querySelector('.gallery'),
};

hideLoadMoreBtn();

const imagesAPIService = new ImagesAPIService();
refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  hideLoadMoreBtn();
  imagesAPIService.query = event.currentTarget.elements.searchQuery.value;
  imagesAPIService.resetPage();
  if (imagesAPIService.query === '' || imagesAPIService.query === ' ') {
    Notiflix.Notify.info('Enter your query to search images.');
    renderImages('');
    return;
  }
  imagesAPIService.getImages().then(imagesMarkup).then(renderImages).then(onFound);
  imagesAPIService.incrementPage();
}

function onLoadMore(event) {
  imagesAPIService.getImages().then(imagesMarkup).then(renderMoreImages);
  imagesAPIService.incrementPage();
}

function renderImages(markup) {
  refs.imagesContainer.innerHTML = markup;
  imagesAPIService.createGallery();
  return imagesAPIService.totalHits;
}

function renderMoreImages(markup) {
  if (imagesAPIService.totalHits <= PER_PAGE * (imagesAPIService.page - 1)) {
    hideLoadMoreBtn();
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
  imagesAPIService.updateGallery();
}

function onFound(total) {
  if (total > 0) {
    Notiflix.Notify.success(`Hooray! We found ${total} images.`);
  }

  if (total > PER_PAGE && imagesAPIService.page > 1) {
    showLoadMoreBtn();
  }
}
