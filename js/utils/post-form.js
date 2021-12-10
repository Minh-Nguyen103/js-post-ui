import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './commom';
import * as yup from 'yup';
import { ImageSource } from '../constants';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); //hidden input
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

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at least two word',
        'Please enter at least two word',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup.string().oneOf([ImageSource.PICSUM, ImageSource.UPLOAD]),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('require', 'Please select image to upload', (field) => Boolean(field?.name))
        .test('max-5mb', 'The image is too large(max 5MB)', (field) => {
          const fieldSize = field?.size || 0;
          const MAX_SIZE = 5 * 1024 * 1024; //5MB
          console.log(fieldSize);
          return fieldSize < MAX_SIZE;
        }),
    }),
  });
}

async function validatePostForm(form, formValues) {
  try {
    //reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => {
      setFieldError(form, name, '');
    });

    //start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    console.log(error.name);
    console.log(error.inner);

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //ignore if the field is already errorLog
        if (errorLog[name]) continue;
        // console.log(validationError.message);
        //set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  //add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function showLoading(form) {
  const buttonElement = form.querySelector('[name="submit"]');
  if (buttonElement) {
    buttonElement.disabled = true;
    buttonElement.textContent = 'Saving...';
  }
}

function hideLoding(form) {
  const buttonElement = form.querySelector('[name="submit"]');
  if (buttonElement) {
    buttonElement.disabled = false;
    buttonElement.textContent = 'Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1378/400`;

    //set imageUrl input + postHeroImage
    setFieldValue(form, '[name="imageUrl"]', imageUrl); //hidden input
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

//S1: loop each radio to get control corresponding

// function hideImageSourceControl(form, checkRadioList) {
//   if (!Array.isArray(checkRadioList)) return;

//   [...checkRadioList].forEach((inputRadio) => {
//     const control = form.querySelector(`[data-radio="${inputRadio.id}"]`);
//     if (!control) return;

//     if (inputRadio.checked) {
//       control.classList.remove('d-none');
//       return;
//     }

//     control.classList.add('d-none');
//   });
// }

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  if (!controlList) return;

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  if (!radioList) return;

  [...radioList].forEach((radio) => {
    radio.addEventListener('change', (e) => {
      renderImageSourceControl(form, e.target.value);
    });
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;

  let temp;

  uploadImage.addEventListener('change', (event) => {
    let data = event.target.files[0];
    data ? (temp = data) : (data = temp);

    const imageUrl = URL.createObjectURL(data);
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  if (!formId || !defaultValues) return;

  const form = document.getElementById('postForm');
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues);

  //init event
  initRadioImageSource(form);
  initRandomImage(form);
  initUploadImage(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Prevent other submission
    if (submitting) return;

    submitting = true;
    showLoading(form);

    //get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    //validation
    //if vaild trigger submit callback
    //otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (!isValid) {
      hideLoding(form);
      submitting = false;
      return;
    }

    await onSubmit?.(formValues);
    setTimeout(() => {
      hideLoding(form);
      submitting = false;
    }, 2000);
  });
}
