import { setBackgroundImage, setFieldValue } from './commom';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imgUrl"]', formValues?.imageUrl); //hidden input
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  const data = new FormData(form);

  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  if (!formId || !defaultValues) return;

  const form = document.getElementById('postForm');
  if (!form) return;

  setFormValues(form, defaultValues);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formValues = getFormValues(form);
    console.log(formValues);
  });
}
