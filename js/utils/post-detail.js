import { setTextContent } from './commom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export function renderPostDetail(post) {
  if (!post) return;

  //render heroImage
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url(${post.imageUrl})`;

    heroImage.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/468x60/?text=thumbnail';
    });
  }

  const postDetail = document.getElementById('postDetail');
  if (!postDetail) return;

  //render title, author, author, description
  setTextContent(postDetail, '#postDetailTitle', post.title);
  setTextContent(postDetail, '#postDetailAuthor', post.author);
  setTextContent(
    postDetail,
    '#postDetailTimeSpan',
    ` - ${dayjs(post.updatedAt).format('DD/MM/YYYY LT')}`
  );
  setTextContent(postDetail, '#postDetailDescription', post.description);

  //render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
  }
}
