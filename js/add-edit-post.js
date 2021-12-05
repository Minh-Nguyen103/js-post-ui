import postApi from './api/postApi';
import { initPostForm } from './utils';

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
      onSubmit: (formValues) => console.log(submit, formValues),
    });
  } catch (error) {
    console.log('fail to fetch post detail', error);
  }
})();
