import getEmployee from '../pages/employee/employee';

const refresh = document.querySelector('.refresh');

refresh.addEventListener('click', function (event) {
    const classOfArea = this.parentElement.parentElement.className;
    classOfArea === 'view' ? refreshView() : null;
});

function refreshView() {
    const list = document.querySelector('.list');
    list.remove();
    const main = document.querySelector('.view, .active');
    renderElement('ul', 'list', '', main);
    if (main.classList.contains('employee')) {
        getEmployee();
    } else if (main.classList.contains('office')) {
        getEmployee();
    }
}

/**
 * @param tagName{string}
 * @param className{string}
 * @param data{string}
 * @param parent{Object}
 */
function renderElement(tagName, className, data, parent) {
    let element = document.createElement(tagName);
    element.classList.add(className);
    element.textContent = data;

    parent.appendChild(element);
}

export default refreshView;
