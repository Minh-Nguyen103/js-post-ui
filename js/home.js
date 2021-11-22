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

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
    //show modal, toast error
  }
})();
