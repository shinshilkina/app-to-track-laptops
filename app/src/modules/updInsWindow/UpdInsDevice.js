import './UpdInsDevice.scss';
import renderDivUpdIns from "./UpdInsDevice.pug";
import dropdownHTML from "../dropdown/dropdown.pug";
import listenDropdownShow from "../dropdown/dropdown";
import {getEmployees, getOffice, getlaptopFromSerialNumber, getEmployeeFindId, getOfficeFindId} from "../requests";
import {getNewRow} from "./window";

/*TODO:
   - 1) подзапросы по всем производителям, моделям, серийный номерам,
    именам работников, кабинетам
   - 2) сделать массив объектов с перечислением статусов,
    операционных систем
   - 3) сделать скрипт плэйсхолдера на подсказки
   - 4) сделать модуль выпадающего списка с перечислением параметров
   - 5) сделать календарь и форматирование данных туда и
   + обратно
   - 6) в редактировании инвентарный и серийный номера не поддержат редактированию
   - 7) при добавлении делать проверку на неповторяемость инвентарного номера
   - 8) input type=number for serial_number, inventory_number
   - 9) input checkbox for depreciation
   - 10) input type=date for date_added, write_off_date
   - 11) дописать запрос: select id_employee from employees where данные
   12) сделать поиск айдишников сотрудника и офиса и запись в поля
   13) сделать отправку данных в бд кроме последних двух элементов значения
 */
const stats = {
   0: 'на складе',
   1: 'в эксплуатации',
   2: 'в ремонте',
   3: 'списан'
};
const operationSystemsValues = {
  0: 'Windows',
  1: 'MacOS',
  2: 'Linux'
};

function listenUpdInsDeviceArea(area, type) {
    const dataInputs = area.querySelectorAll('.date_added, .write_off_date');
    dataInputs.forEach(element => {
        let date = new Date(element.value);
        date = getFormattedDate(date);
        element.value = date;
        element.type = "date";
    });

    const statusInput = area.querySelector('.status');
    renderDropdown(stats, statusInput);

    const operationSystems = area.querySelector('.OS');
    renderDropdown(operationSystemsValues, operationSystems);

    const promise1 = getDataForDevice(area, '.employee-data', getEmployees());
    const promise2 = getDataForDevice(area, '.office-data', getOffice());

    Promise.all([promise1, promise2])
        .then(() => listenDropdownShow(area));

    let inputsNumber = area.querySelectorAll('.serial_number, .inventory_number');
    for (let input of inputsNumber) {
        input.setAttribute('maxLength', 10);
        if (type === 'update'){
            input.setAttribute('disabled', true);
        }
    }

    const depreciationElem = area.querySelector('.depreciation');
    depreciationRender(area, depreciationElem);
    const buttonCancel = area.querySelector('.cancel');
    buttonCancel.addEventListener('click', function (event) {
        area.remove();
    });

    saveChanges(area, type);
}

function saveChanges(area, type) {
    const buttonSave = area.querySelector('.save');
    buttonSave.addEventListener('click', function (event) {
        if (type==='insert') {
            let result = true;
            result = checkInputsNotNull(area);

            const inventoryNumbers = getlaptopFromSerialNumber();
            inventoryNumbers
                .then((res) => {
                    const inventoryNumber = area.querySelector('.inventory_number').value;
                    for (let i = 0; i < res.length; i++){
                        const ObjEntries = Object.values(res[i]);
                        ObjEntries.map((elem) => {
                            if ( elem === inventoryNumber) {
                                alert('Ноутбук с данным инвентарным номером уже существует!');
                                result = false;
                            }
                        });
                    }


                })
                .catch(e => console.error(e));
        }
    });
}

function checkInputsNotNull(area) {
    const rowElements = area.querySelectorAll("input");
    for (let i = 3; i < rowElements.length; i ++) {
        const oldValue = rowElements[i].value;
        if (!oldValue) {
            alert('Не все поля заполнены!');
            return false;
        }
    }
    return true;
}

function depreciationRender(area, depreciationElem) {
    const depreciationDiv = document.createElement("div");
    depreciationDiv.className = 'depreciation__div';
    depreciationElem.after(depreciationDiv);

    const depreciationCheckbox = document.createElement("input");
    depreciationCheckbox.className = 'checkbox';
    depreciationCheckbox.type='checkbox';
    if (depreciationElem.value === '1') {
        depreciationCheckbox.setAttribute('checked', true);
    }
    depreciationDiv.appendChild(depreciationCheckbox);

    const depreciationLabel = document.createElement("div");
    depreciationLabel.className = 'label';
    if (depreciationElem.value === '1') {
        depreciationLabel.textContent='Амортизирован';
    } else {
        depreciationLabel.textContent='Не амортизирован';
    }
    depreciationDiv.appendChild(depreciationLabel);

    listenDepreciation(area, depreciationElem);
}

function listenDepreciation(area, depreciationElem) {
    const depreciationDiv = area.querySelector(".depreciation__div");
    const depreciationCheckbox = depreciationDiv.querySelector(".checkbox");
    const depreciationLabel = depreciationDiv.querySelector(".label");
    depreciationCheckbox.addEventListener('change', function() {
        if(this.checked) {
            depreciationLabel.textContent = 'Амортизирован';
            depreciationElem.value = '1';
            return true;
        } else {
            depreciationLabel.textContent='Не амортизирован';
            depreciationElem.value =  '0';
            return false;
        }
    });
}

function renderDropdown(elements, input) {
    input.classList.add('dropdown__area');
    const dropdown = dropdownHTML(elements);
    input.insertAdjacentHTML('afterend', dropdown);
}

function getDataForDevice(area, classNameElement, query) {
    const input = area.querySelector(classNameElement);
    const queryPromise= query;
    let values = {};
    return queryPromise.then((res) => {
        for (let i = 0; i < res.length; i++){
            let ObjEntries = Object.values(res[i]);
            ObjEntries.shift();
            values[i] = ObjEntries;
        }
        renderDropdown(values, input);
    }).catch(e => console.error(e));
}

function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
}

export default listenUpdInsDeviceArea;
