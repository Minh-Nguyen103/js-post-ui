import { setBackgroundImage, setFieldValue } from './commom';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imgUrl"]', formValues?.imageUrl); //hidden input
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  if (!formId || !defaultValues) return;

  const form = document.getElementById('postForm');
  if (!form) return;

  setFormValues(form, defaultValues);
}
