import './employee.scss';
import renderTable from '../../modules/render_view/render.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice} from '../../modules/requests';
import '../../modules/refreshView';
import windowUpdIns from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";


const getData = () => {
    /**
     * @type {Promise<Object>}
     */
    const responseData = getEmployees();
    responseData.then((data) => {
        renderView({
            headers: [
                {
                    class: 'id_employee',
                    title: 'id'
                },
                {
                    class: 'name',
                    title: 'Имя'
                },
                {
                    class: 'position',
                    title: 'Должность'
                },
                {
                    class: 'phone_number',
                    title: 'Номер телефона'
                },
                {
                    class: 'buttons',
                    title: ''
                }
            ],
            rows: data
        });
        listenButtons();
    })
};

/**
 * @param data{Object}
 */
function renderView(data) {
    const tableHTML = renderTable(data);
    const viewArea = document.querySelector('.list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
}

function listenButtons() {
    const buttonsDelete = document.querySelectorAll('.buttons .button__delete');
    for (let button of buttonsDelete){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id = row.querySelector('.id_employee').textContent;
            const deleteRow = deleteEmployee(id);
            deleteRow.then(setTimeout(refreshView,500));
        });
    }

    const buttonsUpdate = document.querySelector("main").querySelector('.employee').querySelectorAll('.button__update');
    for (let button of buttonsUpdate){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            if (!document.querySelector('.update')) {
                windowUpdIns(row,'update');
            } else {
                const window = document.querySelector('.update');
                const prevId = this.parentElement.parentElement.querySelector('.id_employee').textContent;
                const newID = window.querySelector('.id_employee').value;
                window.remove();
                if (newID != prevId){
                    windowUpdIns(row,'update');
                }
            }
        });
    }
}

const addButton = document.querySelector('.view .add-employee');
addButton.addEventListener('click', function (event) {
    const row = document.querySelector('.view .header');
    windowUpdIns(row,'insert');
});

document.addEventListener("DOMContentLoaded", getData);

export default getData;
