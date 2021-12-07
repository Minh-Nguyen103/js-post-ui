import postApi from './api/postApi';
import { initPostForm } from './utils';

async function handlePostFormSubmit(formValues) {
  // console.log('submit form parent', formValues);

  try {
    //check add/edit mode
    //S1: based on search params (check id)
    //S2: check id from formValues
    //call API
    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    //show success message
    //redirect to post detail
    window.location.assign(`/post-detail.html?id=${savePost.id}`);
  } catch (error) {
    console.log('Failed to save post', post);
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const idPost = searchParams.get('id');

    const defaultValues = Boolean(idPost)
      ? await postApi.getById(idPost)
      : {
          title: '',
          imgURL: '',
          author: '',
          description: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => handlePostFormSubmit(formValues),
    });
  } catch (error) {
    console.log('fail to fetch post detail', error);
  }
})();
