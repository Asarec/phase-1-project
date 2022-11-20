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
                data.data.forEach(result => displayResults(result));
            }
        });
    });
}

/**
 * Creates and appends a list item to the result list.
 * @param {object} result - API result.
 */
function displayResults(result) {
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

/**
 * Calls modal box and displays detailed information about the selected armament.
 * @param {object} result - The selected armament from search results.
 */
function callModal(result) {
    const modalOverlay = createElement('div', {'class': ['modal-bg-overlay']});
    document.body.appendChild(modalOverlay);

    modalOverlay.innerHTML = `
        <div class="modal-container">
            <div class='close'>CLOSE</div>
            <h2>${result.name}</h2>
            <h3>${result.category}</h3>
            <img src="${result.image}" class="modal-image">
            <div class="modal-armament-description">
                <h3>ARMAMENT DESCRIPTION</h3>
                <p class="modal-description">${result.description}</p>
            </div>
            <div class="best-class" style="display:none;"></div>
            <div class="modal-stat-container"></div>
        </div>
    `;

    Object.keys(result).forEach(key => {
        switch (true) {
            case key === 'attack':
                displayStat(result[key], 'attack-rating');
                break;
            case key === 'defence':
                displayStat(result[key], 'defense');
                break;
            case key === 'requiredAttributes':
                displayStat(result[key], 'required-stats');
                break;
            case key === 'scalesWith':
                displayStat(result[key], 'scaling');
                break;
            case key === 'dmgNegation':
                displayStat(result[key], 'damage-negation');
                break;
            case key === 'resistance':
                displayStat(result[key], 'resistance');
        }
    });

    /**
     * Takes a key, retrieves armament stats and displays in the modal box.
     * @param {object} keyName - Houses passed armament stats.
     * @param {string} className - CSS class name used to properly display stats.
     */
    function displayStat(keyName, className) {
        const statListContainer = document.querySelector('.modal-stat-container');
        const statList = createElement('ul', {'class': ['modal-stat-info', className]});

        if (className === 'required-stats') {
            fetch('./db/db.json')
            .then(response => response.json())
            .then(data => {
                const totalClassScores = {};
                const bestClassDiv = document.querySelector('.best-class');
                let bestClass;

                Object.keys(data).forEach(startingClass => {
                    let classScore = 0;

                    Object.keys(data[startingClass]).forEach(classStat => {
                        keyName.forEach(requiredStat => {
                            if (classStat === requiredStat.name) {
                                if (data[startingClass][classStat] < requiredStat.amount || requiredStat.amount - data[startingClass][classStat] >= 0) {
                                    classScore += requiredStat.amount - data[startingClass][classStat];
                                }
                            }
                        });
                    });

                    totalClassScores[startingClass] = classScore;
                });

                bestClass = Object.keys(totalClassScores).reduce((key, value) => totalClassScores[value] < totalClassScores[key] ? value : key);

                bestClassDiv.removeAttribute('style')
                bestClassDiv.innerHTML = `<b>Best Starting Class:</b> ${bestClass}`;
            });
        }

        keyName.forEach(stat => {
            const statItem = document.createElement('li');
            let amountScaling;

            switch (true) {
                case stat.amount !== undefined:
                    amountScaling = stat.amount;
                    break;
                case stat.scaling !== undefined:
                    amountScaling = stat.scaling;
                    break;
                default:
                    amountScaling = 'N/A';
            }

            statItem.innerHTML = `
                <b>${stat.name}</b>
                <span>${amountScaling}</span>
            `;

            statList.appendChild(statItem);
        });

        statListContainer.appendChild(statList);
    }

    document.querySelector('.close').addEventListener('click', _ => modalOverlay.remove());
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') modalOverlay.remove();
    });
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
        switch (true) {
            case key === 'class':
                element.classList.add.apply(element.classList, attributes[key]);
                break;
            case key === 'content':
                element.innerText = attributes[key];
                break;
            default:
                element.setAttribute(key, attributes[key]);
        }
    });

    return element;
}