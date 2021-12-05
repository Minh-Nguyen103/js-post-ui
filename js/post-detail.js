import postApi from './api/postApi';
import { registerLightbox, renderPostDetail } from './utils';

//fetch API
//render detail

async function main() {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    preSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  try {
    //get post id from URL
    const searchParams = new URLSearchParams(window.location.search);
    const idPost = searchParams.get('id');
    if (!idPost) {
      console.log('Post not found');
      return;
    }

    const post = await postApi.getById(idPost);
    // console.log(data);
    renderPostDetail(post);
  } catch (error) {
    console.log('fail to fetch post detail', error);
    //show modal, toast error
  }
}

main();
