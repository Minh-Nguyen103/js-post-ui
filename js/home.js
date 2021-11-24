import postApi from './api/postApi';
import { setTextContent, trucateText } from './utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

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
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = document.getElementById('pagination');
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
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next click');
}

function handleFilterChange(filerName, filterValue) {
  //update queryparams
  const url = new URL(window.location);
  url.searchParams.set(filerName, filterValue);
  history.pushState({}, '', url);

  //fetch API

  //re-render post list
}

function initPagination() {
  //bind click event for prev/next link
  const ulPagination = document.getElementById('pagination');
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

(async () => {
  try {
    initPagination();
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
