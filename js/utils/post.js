import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, trucateText } from './commom';

dayjs.extend(relativeTime);

export function createPostElement(post) {
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
    console.log(post);
    console.log('failed to create post item', error);
  }
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear text content postlist
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
