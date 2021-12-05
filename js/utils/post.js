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
      // console.log(thumbnailElement.error);

      thumbnailElement.addEventListener('error', () => {
        console.log('load img error --> use default placeholder');
        thumbnailElement.src = 'https://via.placeholder.com/468x60/?text=thumbnail';
      });
    }

    //caculator for timespan
    setTextContent(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updatedAt).fromNow()}`);

    //attach event
    //go to post detail when click on div.post-item
    const firstChild = liElement.firstElementChild;
    if (firstChild) {
      firstChild.addEventListener('click', (event) => {
        //S2
        //if event  is triggered from menu -> ignore
        const menu = liElement.querySelector('[data-id="menu"]');
        if (menu && menu.contains(event.target)) return;

        window.location.assign(`/post-detail.html?id=${post.id}`);
      });
    }

    //add click event for edit button
    const editButton = liElement.querySelector('[data-id="edit"]');
    if (editButton) {
      editButton.addEventListener('click', (e) => {
        //prevent event bubbling to parent
        //S1:
        // e.stopPropagation();
        window.location.assign(`/add-edit-post.html?id=${post.id}`);
      });
    }

    return liElement;
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
