import postApi from './api/postApi';
import { ImageSource } from './constants';
import { initPostForm, toast } from './utils';

function removeUnuseFields(formValues) {
  const payLoad = { ...formValues };

  payLoad.imageSource === ImageSource.PICSUM ? delete payLoad.image : delete payLoad.imageUrl;

  delete payLoad.imageSource;

  //delete id if falsy
  if (!payLoad.id) delete payLoad.id;

  return payLoad;
}

function jsonToFromData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  // console.log('submit form parent', formValues, payLoad);
  // return;

  try {
    const payLoad = removeUnuseFields(formValues);
    const formData = jsonToFromData(payLoad);
    // throw new Error('Erro for testing');
    //check add/edit mode
    //S1: based on search params (check id)
    //S2: check id from formValues
    //call API
    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //show success message
    toast.success('Save post successfully!');

    //redirect to post detail
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`);
    }, 2000);
  } catch (error) {
    console.log('Failed to save post', error);
    toast.error(`Error: ${error.message}`);
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
          imageUrl: '',
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
