function showModal(modalElement) {
  if (!window.bootstrap) return;

  var myModal = new bootstrap.Modal(modalElement);
  if (myModal) myModal.show();
}

//hanle click for all img -> Event Delegation
//img click -> find all img with the same album/ gallery
//determine index of selected img
//show modal with selected img
//hanle prev/next click

export function registerLightbox({ modalId, imgSelector, preSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement || modalElement.dataset.register) return;

  //selector
  const imgElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(preSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imgElement || !prevButton || !nextButton) return;

  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    //show image at index
    showImageAtIndex(currentIndex);

    //show modal
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    //show prev img of current album
    currentIndex === 0 ? (currentIndex = imgList.length - 1) : (currentIndex -= 1);

    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    //show next img of current album
    currentIndex === imgList.length - 1 ? (currentIndex = 0) : (currentIndex += 1);

    showImageAtIndex(currentIndex);
  });

  modalElement.dataset.register = 'true';
}
