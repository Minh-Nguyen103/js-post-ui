export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function trucateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imgUrl) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) {
    element.style.backgroundImage = `url("${imgUrl}")`;

    // element.addEventListener('error', () => {
    //   console.log('hinh loi roi ba');
    //   element.style.backgroundImage = `url("https://via.placeholder.com/468x60/?text=postHero")`;
    // });
  }
}

export function randomNumber(n) {
  if (n <= 0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}
