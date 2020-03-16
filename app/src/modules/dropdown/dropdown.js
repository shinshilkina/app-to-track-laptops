import './dropdown.scss'

function listenDropdownShow (parent) {
    const buttonsShowDropdown = parent.querySelectorAll('.dropdown__select');
    console.log('buttons: ' + buttonsShowDropdown);
    for (let button of buttonsShowDropdown){
        button.addEventListener('click',
            function (event) {
            console.log('click button: ' + button);
                let dropdownBody = button.parentElement.querySelector('.dropdown__items');
                dropdownBody.classList.toggle('invisible');
                button.classList.toggle('rotated');
                listenChoice(button);
            }
        );
    }
}

function listenChoice(buttonSelect) {
    const area = buttonSelect.parentElement;
    const input = area.previousSibling;
    const elements = area.querySelectorAll('.item');
    for (let element of elements) {
        element.addEventListener('click', function (event) {
            input.dataset.value = this.dataset.id;
            input.value = element.textContent;
            let dropdownBody = buttonSelect.parentElement.querySelector('.dropdown__items');
            dropdownBody.classList.toggle('invisible');
            buttonSelect.classList.toggle('rotated');
        });
    }
}

export default listenDropdownShow;