import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils';

function showModal(modalElement) {
  if (!window.bootstrap) return;

  var myModal = new bootstrap.Modal(modalElement);
  if (myModal) myModal.show();
}

function renderPostAndPagination(data, pagination) {
  renderPostList('postList', data);
  renderPagination({
    elementId: 'pagination',
    pagination,
    onChange: (page) => handleFilterChange('_page', page),
  });
}

export async function handleFilterChange(filerName, filterValue) {
  try {
    //update queryparams
    const url = new URL(window.location);

    if (filerName) url.searchParams.set(filerName, filterValue);

    //reset page if needed
    if (filerName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    //fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams);
    const dataRemaining = data;
    const paginationRemaining = pagination;

    if (data.length === 0) {
      const page = url.searchParams.get('_page');

      if (Number.parseInt(page) === 1) {
        renderPostAndPagination(dataRemaining, paginationRemaining);
        return;
      }
      // console.log('hahahah');
      url.searchParams.set('_page', Number.parseInt(page) - 1);
      history.pushState({}, '', url);
      const { data, pagination } = await postApi.getAll(url.searchParams);
      renderPostAndPagination(data, pagination);
      return;
    }

    //re-render post list
    renderPostAndPagination(data, pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
}
async function deletePost() {
  try {
    await postApi.remove(this.post.id);
    toast.success('Remove post successfully');
    handleFilterChange();
  } catch (error) {
    console.log('failed to remove post', error);
    toast.error(error.message);
  }
}

function registerPostDeleteEvent() {
  const modalElement = document.getElementById('removePost');
  if (!modalElement) return;

  const messageRemove = modalElement.querySelector('[data-id="message"]');
  const removeButton = modalElement.querySelector('button[data-id="remove"]');
  if (!removeButton || !messageRemove) return;

  let handlerDelete;

  document.addEventListener('post-delete', (event) => {
    if (handlerDelete) {
      removeButton.removeEventListener('click', handlerDelete);
    }

    const post = {
      post: event.detail,
    };

    const message = `Are you sure to remove post ${post.title}`;
    messageRemove.textContent = message;

    showModal(modalElement);

    handlerDelete = deletePost.bind(post);
    removeButton.addEventListener('click', handlerDelete);
  });
}

//MAIN
(async () => {
  try {
    const url = new URL(window.location);

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent();

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });
  } catch (error) {
    console.log('get all failed', error);
    toast.error(error.message);
  }
})();
