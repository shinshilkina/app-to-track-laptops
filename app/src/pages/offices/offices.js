import './offices.scss';
import renderTable from '../../modules/render_view/render.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice} from '../../modules/requests';
import '../../modules/refreshView';
import windowUpdIns from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";


const getDataOffice = () => {
    /**
     * @type {Promise<Object>}
     */
    const responseData = getOffice();
    responseData.then((data) => {
        renderViewOffice({
            headers: [
                {
                    class: 'id_office',
                    title: 'id'
                },
                {
                    class: 'office',
                    title: 'Кабинет'
                },
                {
                    class: 'housing',
                    title: 'Корпус'
                },
                {
                    class: 'type',
                    title: 'Тип кабинета'
                },
                {
                    class: 'buttons',
                    title: ''
                }
            ],
            rows: data
        });
        listenButtonsOffice();
    })
};

/**
 * @param data{Object}
 */
function renderViewOffice(data) {
    const tableHTML = renderTable(data);
    console.log(data);
    console.log(tableHTML);

    const viewArea = document.querySelector("main").querySelector('.office').querySelector('.list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
}

function listenButtonsOffice() {
    const buttonsDeleteOffice = document.querySelector('.view, .office').querySelectorAll('.buttons .button__delete');
    for (let button of buttonsDeleteOffice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id = row.querySelector('.id_employee').textContent;
            const deleteRow = deleteOffice(id);
            deleteRow.then(setTimeout(refreshView,500));
        });
    }

    const buttonsUpdateOffice = document.querySelector('.view, .office').querySelectorAll('.buttons .button__update');
    for (let button of buttonsUpdateOffice){
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

document.addEventListener("DOMContentLoaded", getDataOffice);

export default getDataOffice;