import {getEmployees, getlaptops, getOffice} from "../requests";
import refreshView from "../refreshView";
import {getDataForDevice, makeDropDown} from '../updInsWindow/UpdInsDevice';
import listenDropdownShow from '../dropdown/dropdown';



const area = document.querySelector('.filter-device__items');
getDataForDevice(area, '.filter-employee-input', getEmployees);
getDataForDevice(area, '.filter-office-input', getOffice).then(() => listenDropdownShow(area));
const stats = [
    'на складе',
    'в эксплуатации',
    'в ремонте',
    'списан'
];
makeDropDown(
    area.querySelector('.filter-status-input'),
    () => Promise.resolve(stats.map((title, index) => ({
        title: title,
        id: title
    })))
);

function listenFiltersDevice() {
    const filterArea = document.querySelector('main .device .filter-device__items');
    const buttonCancel = filterArea.querySelector('.cancel');
    const buttonSelect = document.querySelector('.filter-device__select');

    buttonCancel.addEventListener('click', function (event) {
        const inputElements = filterArea.querySelectorAll('input');
        for (let input of inputElements) {

            if (input.type === 'checkbox') {
                input.checked = false;
                filtersService.setAmoAmo(false);
                filtersService.setAmoNotAmo(false);
            } else
            if (input.type === 'date') {
                input.value = input.defaultValue;
                filtersService.setAddedStart(null);
                filtersService.setAddedEnd(null);
                filtersService.setOffStart(null);
                filtersService.setOffEnd(null);
            } else {
                input.value = input.defaultValue;
                input.dataset.value ? delete input.dataset.value : null;
                filtersService.setOffice(null);
                filtersService.setEmployee(null);
                filtersService.setStatus(null);
            }
        }
        const area = document.querySelector('main .device');
        refreshView(area);
    });

    const buttonSave = filterArea.querySelector('.save');
    buttonSave.addEventListener('click', function (event) {
        getlaptops().then((res) => {
            const area = document.querySelector('main .device');
            refreshView(area);
        }).catch((e) => console.log(e));
    });
}

window.filtersService = {
    order: {
        vendor: false,
        inventary_number: true
    },
    amo: {
        amo: false,
        not_amo: false
    },
    added: {
        from: null,
        to: null
    },
    off: {
        from: null,
        to: null
    },
    status: {
        status: null
    },
    employee: {
        id: null
    },
    office: {
        id: null
    },
    setOrderVendor(bool) {
        this.order.vendor = bool;
    },
    getOrderVendor() {
        return this.order.vendor;
    },
    setOrderInventaryNumber(bool) {
        this.order.inventary_number = bool;
    },
    getOrderInventaryNumber() {
        return this.order.inventary_number;
    },
    setAmoAmo(bool) {
        this.amo.amo = bool;
    },
    getAmoAmo() {
        return this.amo.amo;
    },
    setAmoNotAmo(bool) {
        this.amo.not_amo = bool;
    },
    getAmoNotAmo() {
        return this.amo.not_amo;
    },
    setAddedStart(date) {
        this.added.from = date;
    },
    getAddedStart() {
        return this.added.from;
    },
    setAddedEnd(date) {
        this.added.to = date;
    },
    getAddedEnd() {
        return this.added.to;
    },
    setOffStart(date) {
        this.off.from = date;
    },
    getOffStart() {
        return this.off.from;
    },
    setOffEnd(date) {
        this.off.to = date;
    },
    getOffEnd() {
        return this.off.to;
    },
    setStatus(status) {
        this.status.status = status;
    },
    getStatus() {
        return this.status.status;
    },
    setEmployee(id) {
        this.employee.id = id;
    },
    getEmployee() {
        return this.employee.id;
    },
    setOffice(id) {
        this.office.id = id;
    },
    getOffice() {
        return this.office.id;
    }
};

const orderVendor = document.querySelector('main .filter-device__items .filter-abc-radio');
orderVendor.addEventListener( 'change', function() {
    filtersService.setOrderVendor(this.checked);
    filtersService.setOrderInventaryNumber(null);
});

const orderInventaryNumber = document.querySelector('main .filter-device__items .filter-inventary_number-radio');
orderInventaryNumber.addEventListener( 'change', function() {
    filtersService.setOrderInventaryNumber(this.checked);
    filtersService.setOrderVendor(null);
});

const amoNotAmo = document.querySelector('main .filter-device__items .filter-depreciation-off-checkbox');
amoNotAmo.addEventListener( 'change', function() {
    filtersService.setAmoNotAmo(this.checked);
});

const amoAmo = document.querySelector('main .filter-device__items .filter-depreciation-on-checkbox');
amoAmo.addEventListener( 'change', function() {
    filtersService.setAmoAmo(this.checked);
});

const addedFrom = document.querySelector('main .filter-device__items .filter-date-add-start-input');
addedFrom.addEventListener( 'input', function() {
    filtersService.setAddedStart(addedFrom.value);
});

const addedTo = document.querySelector('main .filter-device__items .filter-date-add-end-input');
addedTo.addEventListener( 'input', function() {
    filtersService.setAddedEnd(addedTo.value);
});

const offFrom = document.querySelector('main .filter-device__items .filter-date-off-start-input');
offFrom.addEventListener( 'input', function() {
    filtersService.setOffStart(offFrom.value);
});

const offTo = document.querySelector('main .filter-device__items .filter-date-off-end-input');
offTo.addEventListener( 'input', function() {
    filtersService.setOffEnd(offTo.value);
});

const statusValue = document.querySelector('.filter-status-input');
statusValue.addEventListener( 'change', function() {
    filtersService.setStatus(statusValue.dataset.value);
});

const employeeId = document.querySelector('.filter-employee-input');
employeeId.addEventListener( 'change', function() {
    filtersService.setEmployee(employeeId.dataset.value);
});

const officeId = document.querySelector('.filter-office-input');
officeId.addEventListener( 'change', function() {
    filtersService.setOffice(officeId.dataset.value);
});


export {listenFiltersDevice};
