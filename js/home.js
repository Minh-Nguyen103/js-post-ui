import postApi from './api/postApi';
import { getUlPagination, setTextContent, trucateText } from './utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';

dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  try {
    //find and clone template
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    //update title, thumbnail, description, author
    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', trucateText(post.description, 100));
    setTextContent(liElement, '[data-id="author"]', post.author);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;

      thumbnailElement.addEventListener('error', () => {
        thumbnailElement.src = 'https://via.placeholder.com/468x60/?text=thumbnail';
      });
    }

    //caculator for timespan
    setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

    return liElement;
    //attach event
  } catch (error) {
    console.log('failed to create post item', error);
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  //clear text content postlist
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
  if (!pagination || !ulPagination) return;

  //calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalRows = Math.ceil(_totalRows / _limit);

  //save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalRows = _totalRows;

  //check if enable.disable prev link
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
  else ulPagination.firstElementChild.classList.remove('disabled');

  //check if enable.disable next link
  if (_page >= totalRows) ulPagination.lastElementChild.classList.add('disabled');
  else ulPagination.lastElementChild.classList.remove('disabled');
}

function handlePreClick(e) {
  e.preventDefault();
  console.log('prev click');

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 2;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next click');

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalRows = ulPagination.dataset.totalRows;
  if (page >= totalRows) return;

  handleFilterChange('_page', page + 1);
}

async function handleFilterChange(filerName, filterValue) {
  //update queryparams
  const url = new URL(window.location);
  url.searchParams.set(filerName, filterValue);

  //reset page if needed
  if (filerName === 'title_like') url.searchParams.set('_page', 1);

  history.pushState({}, '', url);

  //fetch API
  const { data, pagination } = await postApi.getAll(url.searchParams);
  //re-render post list
  renderPostList(data);
  renderPagination(pagination);
}

function initPagination() {
  //bind click event for prev/next link
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  //add click event for prev link
  const preLink = ulPagination.firstElementChild?.firstElementChild;
  if (preLink) {
    preLink.addEventListener('click', handlePreClick);
  }

  //add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}

function initURL() {
  //update queryparams
  const url = new URL(window.location);

  //update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  //set default values from query params
  //title_like
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }

  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  );

  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    //attach event
    initPagination();
    initSearch();
    initURL();

    const queryParams = new URLSearchParams(window.location.search);

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
    //show modal, toast error
  }
})();
