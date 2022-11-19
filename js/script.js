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
    } else {
        listOfResults.remove();
        form.firstChild.classList.remove('active-input');
        form.after(errorMsg);
    }
});

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