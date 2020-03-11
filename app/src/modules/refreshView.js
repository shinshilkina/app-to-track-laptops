import getEmployee from '../pages/employee/employee';
import getOffice from '../pages/offices/offices';
import getDataDevice from "../pages/device/device";

const refresh = document.querySelectorAll('.refresh');

for (let button of refresh) {
    button.addEventListener('click', function (event) {
        const classOfArea = this.parentElement.parentElement;
        if (classOfArea.classList.contains('view')){
            refreshView(classOfArea);
        }
    });
}

function refreshView(classOfArea) {
    const list = classOfArea.querySelector('.list');
    list.remove();
    renderElement('ul', 'list', '', classOfArea);
    if (classOfArea.classList.contains('employee')) {
        getEmployee();
    }
    if (classOfArea.classList.contains('office')) {
        getOffice();
    }
    if (classOfArea.classList.contains('device')) {
        getDataDevice();
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
