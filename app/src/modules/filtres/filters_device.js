import {getlaptops} from "../requests";

function listenFiltersDevice() {
    const filterArea = document.querySelector('main .device .filter-device__items');
    const buttonCancel = filterArea.querySelector('.cancel');

    buttonCancel.addEventListener('click', function (event) {
        const inputElements = filterArea.querySelectorAll('input');
        for (let input of inputElements) {
            if (input.type === 'checkbox') {
                input.checked = true;
            }
            if (input.type === 'date') {
                input.value = input.defaultValue;
            }
        }
        filterArea.classList.toggle('invisible');
    });

    const buttonSave = filterArea.querySelector('.save');

    buttonSave.addEventListener('click', function (event) {
        console.log(filtersService);
        getlaptops().then((res) => console.log(res)).catch((e) => console.log(e));
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
    }
};

const orderVendor = document.querySelector('main .filter-device__items .filter-abc-radio');
orderVendor.addEventListener( 'change', function() {
    filtersService.setOrderVendor(this.checked);
});

const orderInventaryNumber = document.querySelector('main .filter-device__items .filter-inventary_number-radio');
orderInventaryNumber.addEventListener( 'change', function() {
    filtersService.setOrderInventaryNumber(this.checked);
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

export {listenFiltersDevice};
