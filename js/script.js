const form = document.querySelector('form');
const listOfResults = createElement('ul', {'class': ['search-results-list']});
const errorMsg = createElement('h3', {
    'class': ['error'],
    'content': 'PLEASE TRY AGAIN'
});

form.addEventListener('submit', event => {
    event.preventDefault();

    if (form.firstChild.value.trim()) {
        errorMsg.remove();
        form.firstChild.classList.add('active-input');
        form.after(listOfResults);
        fetchResults(form.firstChild.value);
    } else {
        listOfResults.remove();
        form.firstChild.classList.remove('active-input');
        form.after(errorMsg);
    }
});

/**
 * Submits a fetch request to the API and invoke the results through another function.
 * @param {string} query - The query submitted by the input field.
 */
function fetchResults(query) {
    let resultCount = 0;
    const armamentCategories = ['weapons', 'armors'];
    const noResultsMsg = createElement('h2', {
        'class': ['result-error'],
        'content': 'NO RESULTS FOUND'
    });

    listOfResults.innerHTML = '';
}

/**
 * Creates an element with attributes and values.
 * @param {string} tag - HTML tag to create.
 * @param {Object} attributes - Attributes to be assigned to the element.
 * @returns {Object} - Newly created element with specified attributes.
 */
function createElement(tag, attributes) {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
        if (key === 'class') {
            element.classList.add.apply(element.classList, attributes[key]);
        } else if (key ==='content') {
            element.innerText = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });

    return element;
}