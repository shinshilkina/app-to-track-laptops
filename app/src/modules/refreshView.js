import getEmployee from '../pages/employee/employee';

const refresh = document.querySelector('.refresh');

refresh.addEventListener('click', function (event) {
    const classOfArea = this.parentElement.parentElement.className;
    classOfArea === 'view' ? refreshEmployee() : console.log('-');
});

function refreshEmployee() {
    /*const updateEmployeeArea = document.body.querySelector('main').querySelector('.update');
    if (!updateEmployeeArea.classList.contains('unvisible')) {
        updateEmployeeArea.classList.add('unvisible');
    }*/

    const listEmployees = document.querySelector('.list');
    listEmployees.remove();
    const main = document.querySelector('.view');
    renderElement('ul', 'list', '', main);
    getEmployee();
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

export default refreshEmployee;
