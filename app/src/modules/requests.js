/**
 * @param  method {string}
 * @param  url{string}
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const sendHttpRequest = (method, url, data) => {
    return fetch(url, {
        method: method,
        cache: 'reload',
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        if (response.status >= 400) {
            return response.json().then(errResData => {
                const error = new Error('Something went wrong!');
                error.data = errResData;
                throw error;
            });
        }
        return response.json();
    });
};

/**
 * @returns {Promise<Object>}
 */
const getEmployees = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/employees/list');
};

const getEmployeeNames = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/employees/list/name');
};

const getEmployeePositions = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/employees/list/position');
};

const getEmployeeFromId = (id) => {
    return sendHttpRequest('POST', 'http://localhost:5000/employees/list/id', {
        id_employee: id
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);

        });
};
const getEmployeeFindId = ([name, position, phone]) => {
    phone = parseInt(phone, 10);
    if (!isNaN(phone) ) {
        return sendHttpRequest('POST', 'http://localhost:5000/employees/list/find_id', {
            name: name,
            position: position,
            phone_number: phone
        })
            .then(responseData => {
                return responseData;
            })
            .catch(err => {
                console.log(err);

            });
    }
};
/**
 * @param id
 * @returns {Promise<Object>}
 */
const deleteEmployee = (id) => {
    return sendHttpRequest('POST', 'http://localhost:5000/employees/delete', {
        id_employee: id
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * @param name
 * @param position
 * @param phone
 * @returns {Promise<Object>}
 */
const sendEmployee = ([name, position, phone]) => {
    phone = parseInt(phone, 10);
    if (!isNaN(phone) ) {
        return sendHttpRequest('POST', 'http://localhost:5000/employees/add', {
            name: name,
            position: position,
            phone_number: phone
        })
            .then(responseData => {
                console.log(responseData);
            })
            .catch(err => {
                console.log(err);
            });
    }
    else alert('Номер телефона вводится только цифрами');

};
/**
 * @param id
 * @param name
 * @param position
 * @param phone
 * @returns {Promise<Object>}
 */
const updateEmployee = ([id, name, position, phone]) => {
    phone = parseInt(phone, 10);
    if (!isNaN(phone) ) {
        return sendHttpRequest('POST', 'http://localhost:5000/employees/update', {
            id_employee: id,
            name: name,
            position: position,
            phone_number: phone
        })
            .then(responseData => {
                console.log(responseData);
            })
            .catch(err => {
                console.log(err);
            });
    }
    else alert('Номер телефона вводится только цифрами');
};

//laptops

const getlaptops = () => {
    const filtersService = window.filtersService;
    const params = {};
    const vendor = filtersService.getOrderVendor();
    if (vendor) {
        params['vendor'] = vendor;
    }
    const inventaryNumber = filtersService.getOrderInventaryNumber();
    if (inventaryNumber) {
        params['inventary_number'] = inventaryNumber;
    }
    const amoOn = filtersService.getAmoAmo();
    if (amoOn) {
        params['amo_on'] = amoOn;
    }
    const amoOff = filtersService.getAmoNotAmo();
    if (amoOff) {
        params['amo_off'] = amoOff;
    }
    const addedFrom = filtersService.getAddedStart();
    if (addedFrom) {
        params['added_from'] = addedFrom;
    }
    const addedTo = filtersService.getAddedEnd();
    if (addedTo) {
        params['added_to'] = addedTo;
    }
    const writtenOffFrom = filtersService.getOffStart();
    if (writtenOffFrom) {
        params['off_from'] = writtenOffFrom;
    }
    const writtenOffTo = filtersService.getOffEnd();
    if (writtenOffTo) {
        params['off_to'] = writtenOffTo;
    }
    const employeeId = filtersService.getEmployee();
    if (employeeId) {
        params['employee'] = employeeId;
    }
    const officeId = filtersService.getOffice();
    if (officeId) {
        params['office'] = officeId;
    }
    const query = Object.keys(params).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
    return sendHttpRequest('GET', 'http://localhost:5000/device/list?' + query);
};

const getlaptopFromId = (id_device) => {
    return sendHttpRequest('POST', 'http://localhost:5000/device/list/id', {
        id_device: id_device
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);
        });
};

const getEmployeeLaptops = (id_employee) => {
    return sendHttpRequest('POST', 'http://localhost:5000/device/list/employee', {
        id_employee: id_employee
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);
        });
};
const getLocationLaptops = (id_office) => {
    return sendHttpRequest('POST', 'http://localhost:5000/device/list/office', {
        id_office: id_office
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);
        });
};

const getlaptopFromManufacturer = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/device/list/manufacturer');
};

const getlaptopFromModels= () => {
    return sendHttpRequest('GET', 'http://localhost:5000/device/list/model');
};

const getlaptopFromSerialNumber = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/device/list/inventory_number')
        .then((res) => res.map((data) => data['inventory_number']));
};

const deletelaptops = (id) => {
    return sendHttpRequest('POST', 'http://localhost:5000/device/delete', {
        id_device: id
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

const sendlaptops = ([id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                         write_off_date, description, OS, status, depreciation, depreciation_lenght]) => {
    id_employee = parseInt(id_employee, 10);
    id_office = parseInt(id_office, 10);
    if (depreciation === '1') {
        depreciation = true;
    } else depreciation=false;

    return sendHttpRequest('POST', 'http://localhost:5000/device/add', {
        id_employee : id_employee,
        id_office : id_office,
        manufacturer : manufacturer,
        model : model,
        serial_number : serial_number,
        inventory_number : inventory_number,
        date_added :date_added,
        write_off_date : write_off_date,
        description : description,
        OS : OS,
        status: status,
        depreciation : depreciation,
        depreciation_lenght : depreciation_lenght
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

const updatelaptops = ([id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                           write_off_date, description, OS, status, depreciation, depreciation_lenght, id_device]) => {

   // date_added = convertToDataTime(date_added);
    //write_off_date = convertToDataTime(write_off_date);

    return sendHttpRequest('POST', 'http://localhost:5000/device/update', {
        id_employee : id_employee,
        id_office : id_office,
        manufacturer : manufacturer,
        model : model,
        serial_number : serial_number,
        inventory_number : inventory_number,
        date_added :date_added,
        write_off_date : write_off_date,
        description : description,
        OS : OS,
        status: status,
        depreciation : depreciation,
        depreciation_lenght : depreciation_lenght,
        id_device : id_device
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

function convertToDataTime(date) {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 19).replace('T', ' ');
}

//OFFICES

const getOffice = () => {
    return sendHttpRequest('GET', 'http://localhost:5000/offices/list');
};

const getOfficeFromId = (id_office) => {
    return sendHttpRequest('POST', 'http://localhost:5000/offices/list/id', {
        id_office: id_office
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);
        });
};

const getOfficeFindId = ([office, housing, type]) => {
    return sendHttpRequest('POST', 'http://localhost:5000/offices/list/find_id', {
        office : office,
        housing : housing,
        type : type
    })
        .then(responseData => {
            return responseData;
        })
        .catch(err => {
            console.log(err);
        });
};

const deleteOffice = (id_office) => {
    return sendHttpRequest('POST', 'http://localhost:5000/offices/delete', {
        id: id_office
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

const sendOffice = ([office, housing, type]) => {

    return sendHttpRequest('POST', 'http://localhost:5000/offices/add', {
        office : office,
        housing : housing,
        type : type
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 *
 * @param office{string}
 * @param housing{string}
 * @param type{string}
 * @param id_office{string}
 * @returns {Promise<Object>}
 */
const updateOffice = ([id_office, office, housing, type]) => {
    return sendHttpRequest('POST', 'http://localhost:5000/offices/update', {
        office : office,
        housing : housing,
        type : type,
        id_office : id_office
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

export {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId, getOfficeFromId,
    getlaptopFromId, getlaptopFromManufacturer, getlaptopFromModels, getlaptopFromSerialNumber,
    getEmployeeFindId, getOfficeFindId, getEmployeeLaptops, getLocationLaptops,
    getEmployeeNames, getEmployeePositions};