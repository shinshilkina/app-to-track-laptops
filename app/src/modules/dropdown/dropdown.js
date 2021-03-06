import './dropdown.scss'

function listenDropdownShow (area) {
    addAllVariantsItem();
    const buttonsShowDropdown = area.querySelectorAll('.dropdown__select');
    for (let button of buttonsShowDropdown){
        button.addEventListener('click',
            function (event) {
                let dropdownBody = button.parentElement.querySelector('.dropdown__items');
                dropdownBody.classList.toggle('invisible');
                button.classList.toggle('rotated');
            }
        );
        listenChoice(button);
    }
    const dropdownInputs = area.querySelectorAll('.dropdown__area');
    for (let input of dropdownInputs) {
        if (input.type === 'text') {
            input.addEventListener('click', function (event) {
                const dropdown = input.nextSibling;
                const dropdownSelect = dropdown.querySelector('.dropdown__select');
                const dropdownItems = dropdown.querySelector('.dropdown__items');
                dropdownItems.classList.toggle('invisible');
                dropdownSelect.classList.toggle('rotated');
                listenChoice(dropdownSelect);
            });
        }
    }
}

function checkExistAllVariants(areaItems) {
       const allDivElements = areaItems.querySelectorAll('div');
        for (let element of allDivElements) {
            if (element.textContent === 'Все'){
                return true;
            }
        }
    return false;
}

function addAllVariantsItem() {
    const items = document.querySelectorAll('.dropdown__items');

    for (let item of items) {
        const existVariant = checkExistAllVariants(item);
        const parentPopUp = item.parentElement.parentElement.parentElement;
        if (existVariant === false && !parentPopUp.classList.contains('view-div-updIns')) {
            const liElement = document.createElement('li');
            const divElement = document.createElement('div');
            divElement.textContent = 'Все';
            divElement.className = 'item';
            divElement.dataset.id = null;
            liElement.appendChild(divElement);
            item.prepend(liElement);
        }
    }
}

function listenChoice(buttonSelect) {
    const area = buttonSelect.parentElement;
    const input = area.previousSibling;
    const elements = area.querySelectorAll('.item');

    getValueOption(input, elements, buttonSelect);

    for (let element of elements) {
        element.addEventListener('click', function () {
            this.dataset.id !== 'null' ? input.dataset.value = this.dataset.id :
                delete input.dataset.value;
            input.value = element.textContent;
            if (input.type === 'text') {
                input.dispatchEvent(new Event('change'));
            }
            let dropdownBody = buttonSelect.parentElement.querySelector('.dropdown__items');
            if (!dropdownBody.classList.contains('invisible')) {
                dropdownBody.classList.toggle('invisible');
                buttonSelect.classList.toggle('rotated');
            }
        });
    }
}

function getValueOption(parentInput, elementsDropdown, buttonSelect) {
    if (parentInput.type === 'text') {
        parentInput.addEventListener('keyup', function () {
            let dropdownBody = parentInput.parentElement.querySelector('.dropdown__items');
            if (dropdownBody.classList.contains('invisible')) {
                dropdownBody.classList.toggle('invisible');
                buttonSelect.classList.toggle('rotated');
            }

            for (let element of elementsDropdown) {
                const elementText = element.textContent.toUpperCase();
                const inputText = parentInput.value.toUpperCase();
                if (inputText && !elementText.includes(inputText)) {
                    element.classList.add('invisible');
                } else if (!inputText || elementText.includes(inputText)) {
                    element.classList.contains('invisible') ? element.classList.remove('invisible') : null;
                }
            }
        });
    }
}

export default listenDropdownShow;