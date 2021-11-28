export function renderPagination({ elementId, pagination, onChange }) {
  const ulPagination = document.getElementById(elementId);

  if (!pagination || !ulPagination) return;

  //calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  //save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = _totalRows;

  //clear old page
  const preLink = ulPagination.firstElementChild;
  const nextLink = ulPagination.lastElementChild;
  ulPagination.textContent = '';
  ulPagination.appendChild(preLink);
  ulPagination.appendChild(nextLink);

  //render page number
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const pageItem = createPageItem('pagination', pageNumber, onChange);
    nextLink.before(pageItem);
  }

  //check if enable.disable prev link
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
  else ulPagination.firstElementChild.classList.remove('disabled');

  //check if enable.disable next link
  if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled');
  else ulPagination.lastElementChild.classList.remove('disabled');
}

function createPageItem(elementId, pageNumber, onChange) {
  if (!pageNumber || !elementId) return;

  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  const pageItem = ulPagination.firstElementChild.cloneNode(true);
  if (!pageItem) return;
  pageItem.classList.remove('disabled');

  const textPage = pageItem.querySelector('.page-link');
  if (textPage) textPage.textContent = pageNumber;

  //set style current active page
  if (pageNumber === Number.parseInt(ulPagination.dataset.page)) {
    textPage.style.color = 'white';
    textPage.style.background = '#dc1b1b';
  }

  //attach event for page
  pageItem.addEventListener('click', (e) => {
    e.preventDefault();

    onChange?.(pageNumber);
  });

  return pageItem;
}

export function initPagination({ elementId, defaultParams, onChange }) {
  //bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  //set current active page
  //TODO: use default Params
  if (defaultParams) onChange?.(defaultParams.get('_page'));

  //add click event for prev link
  const preLink = ulPagination.firstElementChild?.firstElementChild;
  if (preLink) {
    preLink.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if (page >= 2) onChange?.(page - 1);
    });
  }

  //add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();

      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = ulPagination.dataset.totalPages;
      if (page < totalPages) onChange?.(page + 1);
    });
  }
}
