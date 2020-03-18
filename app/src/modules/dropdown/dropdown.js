import './dropdown.scss'

function listenDropdownShow (parent) {
    addAllVariantsItem();
    const buttonsShowDropdown = parent.querySelectorAll('.dropdown__select');
    for (let button of buttonsShowDropdown){
        button.addEventListener('click',
            function (event) {
                let dropdownBody = button.parentElement.querySelector('.dropdown__items');
                dropdownBody.classList.toggle('invisible');
                button.classList.toggle('rotated');
                listenChoice(button);
            }
        );
    }
}

function addAllVariantsItem() {
    const items = document.querySelectorAll('.dropdown__items');
    for (let item of items) {
        const liElement = document.createElement('li');
        const divElement = document.createElement('div');
        divElement.textContent = 'Все';
        divElement.className = 'item';
        divElement.dataset.id = null;
        liElement.appendChild(divElement);
        item.prepend(liElement);
    }
}

function listenChoice(buttonSelect) {
    const area = buttonSelect.parentElement;
    const input = area.previousSibling;
    const elements = area.querySelectorAll('.item');
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

export default listenDropdownShow;