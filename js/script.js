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

    armamentCategories.forEach(category => {
        fetch(`https://eldenring.fanapis.com/api/${category}?name=${query}`)
        .then(response => response.json())
        .then(data => {
            resultCount += data.count;
            if (resultCount === 0) {
                listOfResults.innerHTML = '';
                listOfResults.appendChild(noResultsMsg);
            } else {
                noResultsMsg.remove();
                data.data.forEach(result => displayResults(result, category));
            }
        });
    });
}

/**
 * Creates and appends a list item to the result list.
 * @param {object} result - API result.
 * @param {string} category - API result's category.
 */
function displayResults(result, category) {
    const resultContainer = document.createElement('li');
    listOfResults.appendChild(resultContainer);
    resultContainer.innerHTML = `
        <img src="${result.image}" class="result-list-image">
        <div>
            <h2>${result.name}</h2>
            <h3>${result.category}</h3>
        </div>
    `;

    resultContainer.addEventListener('click', event => {
        if (event.currentTarget) callModal(result);

        form.firstChild.value = '';
        form.firstChild.classList.remove('active-input');
        listOfResults.remove();
    });
}

function callModal(result) {}

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