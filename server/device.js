const stringify = require('csv-stringify');

module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/device/list', async (req, res) => {
        const vendor = req.query.vendor === 'true';
        const inventaryNumber = req.query.inventary_number === 'true';
        const amoOn = req.query.amo_on === 'true';
        const amoOff = req.query.amo_off === 'true';
        const addedFrom = req.query.added_from;
        const addedTo = req.query.added_to;
        const offFrom = req.query.off_from;
        const offTo = req.query.off_to;
        const status = req.query.status;
        const employee = req.query.employee;
        const office = req.query.office;

        const order = [];
        const conditions = [];

        if (vendor) {
            order.push('manufacturer');
        }
        if (inventaryNumber) {
            order.push('inventory_number');
        }
        if (amoOn) {
            conditions.push(['depreciation', '=', '1']);
        }
        if (amoOff) {
            conditions.push(['depreciation', '=', '0']);
        }
        if (addedFrom) {
            conditions.push(['date_added', '>=', addedFrom]);
        }
        if (addedTo) {
            conditions.push(['date_added', '<=', addedTo]);
        }
        if (offFrom) {
            conditions.push(['write_off_date', '>=', offFrom]);
        }
        if (offTo) {
            conditions.push(['write_off_date', '<=', offTo]);
        }
        if (status) {
            conditions.push(['status', '=', status]);
        }
        if (employee) {
            conditions.push(['id_employee', '=', employee]);
        }
        if (office) {
            conditions.push(['id_office', '=', office]);
        }

        let queryPostfix = '';

        if (conditions.length) {
            queryPostfix = ' WHERE ';
        }

        queryPostfix += conditions
            .map((tuple) => {
                const isDate = ['date_added', 'write_off_date'].includes(tuple[0]);
                return `${tuple[0]} ${tuple[1]} ` + (isDate ? `STR_TO_DATE(?, '%Y-%m-%d')` : `?`);
            })
            .join(' AND ');

        if (order.length) {
            queryPostfix += ` ORDER BY ${order.join(',')}`;
        }

        try {
            console.log('SELECT * FROM device' + queryPostfix);
            console.log(conditions);
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM device' + queryPostfix,
                [...conditions.map(tuple => tuple[2])]
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.post('/device/list/id', async (req, res) => {
        const {id_device} = req.body;
        try {
            const [rows, fields] = await mysqlQuery(
                `SELECT * FROM device WHERE id_device = ?`,
                [id_device]
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.get('/device/list/manufacturer', async (req, res) => {
        try {
            const [rows, fields] = await mysqlQuery(
                'SELECT manufacturer FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.get('/device/list/model', async (req, res) => {
        try {
            const [rows, fields] = await mysqlQuery(
                'SELECT model FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.get('/device/list/inventory_number', async (req, res) => {
        try {
            const [rows, fields] = await mysqlQuery(
                'SELECT inventory_number FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.post('/device/add', async (req, res) => {
        let {id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
            write_off_date, description, OS,status, status_date, depreciation, depreciation_lenght} = req.body;
        id_employee === 'null' ? id_employee = null: null;
        id_office === 'null' ? id_office = null: null;
        try {
            await mysqlQuery(
                `INSERT INTO device(id_employee, id_office, manufacturer, model, serial_number, inventory_number, 
                date_added, write_off_date, description, OS, status, status_date, depreciation, depreciation_lenght) 
                VALUES (?, ?, ?, ?, ?, ?, STR_TO_DATE(?,'%Y-%m-%d'), STR_TO_DATE(?,'%Y-%m-%d'), ?, ?, ?, ?, ?, ?);`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS, status, status_date, depreciation, depreciation_lenght]
            );
            res.status(200).send({
                success: true
            });
        } catch (e){
            restAPIerror(res, e);
        }
    });

    app.post('/device/list/employee', async (req, res) => {
        const {id_employee} = req.body;
        try {
            const [rows] = await mysqlQuery(
                `SELECT * FROM device WHERE id_employee = ?;`,
                [id_employee]
            );
            res.status(200).send(rows);
        } catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/device/list/office', async (req, res) => {
        const {id_office} = req.body;
        try {
            const [rows] = await mysqlQuery(
                `SELECT * FROM device WHERE id_office = ?;`,
                [id_office]
            );
            res.status(200).send(rows);
        } catch (e){
            restAPIerror(res, e);
        }
    });

    app.post('/device/delete', async (req, res) => {
        const {id_device} = req.body;
        try {
            await mysqlQuery(
                `DELETE FROM device WHERE id_device = ?;`,
                [id_device]
            );
            res.status(200).send({
                success: true
            });
        } catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/device/update', async (req, res) => {
        let {id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
            write_off_date, description, OS,status, status_date, depreciation, depreciation_lenght, id_device} = req.body;
        id_employee === 'null' ? id_employee = null: null;
        id_office === 'null' ? id_office = null: null;
        try {
            await mysqlQuery(
                `UPDATE device SET id_employee = ?, 
                    id_office = ?, manufacturer = ?, model = ?,
                    serial_number = ?, inventory_number = ?,
                    date_added = ?, write_off_date = ?, 
                    description = ?, OS = ? ,status =? , 
                    status_date = ?, depreciation = ?, 
                    depreciation_lenght = ?
                    WHERE id_device = ?;`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS,status, status_date, depreciation, depreciation_lenght, id_device]
            );
            res.status(200).send({
                success: true
            });
        } catch (e){
            restAPIerror(res,e);
        }
    });
    app.get('/device/download', async (req, res) => {
        try {
            const [rows] = await mysqlQuery(
            `select device.manufacturer, device.model, device.serial_number, device.inventory_number, device.date_added,
            device.write_off_date, device.description, device.OS, device.status, device.status_date, device.depreciation, device.depreciation_lenght,
            employees.name, employees.position, employees.phone_number, offices.office, offices.housing, offices.type 
            from device left join employees ON device.id_employee = employees.id_employee left join offices ON device.id_office = offices.id_office;`
        );

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Pragma', 'no-cache');

            res.status(200);

            const rowsJSON = Object.values(JSON.parse(JSON.stringify(rows)));
            const map = {
                'manufacturer': 'Производитель',
                'model': 'Модель',
                'serial_number': 'Серийный номер',
                'inventory_number': 'Инвентарный номер',
                'date_added': 'Дата поступления',
                'write_off_date': 'Дата списания',
                'description': 'Описание',
                'OS': 'Операционная система',
                'status': 'Статус',
                'status_date': 'Дата статуса',
                'depreciation': 'Амортизация',
                'depreciation_lenght': 'Срок амортизации',
                'name': 'ФИО сотрудника',
                'position': 'Должность',
                'phone_number': 'Номер телефона',
                'office': 'Кабинет',
                'housing': 'Корпус',
                'type': 'Тип кабинета'
            };
            let resultObjects = rowsJSON.map((obj) => Object.keys(map).reduce((result, k) => {result[map[k]] = obj[k]; return result;}, {}));

            const getFormattedDate  = (date) => {
                if (date) {
                    const year = date.substring(0, 4);
                    const month = date.substring(5, 7);
                    const day = date.substring(8, 10);

                    return day + '/' + month + '/' + year;
                } else {
                    return date;
                }
            };

            const getValueDepreciation = (dep) => {
                let result;
                if (dep === 0) {
                    result = 'Не амортизирован';
                } else if (dep === 1) {
                    result = 'Амортизирован';
                }
                return result;
            };

            resultObjects = resultObjects.map((obj) => {
                obj['Дата поступления'] = getFormattedDate(obj['Дата поступления']);
                obj['Дата списания'] = getFormattedDate(obj['Дата списания']);
                obj['Дата статуса'] = getFormattedDate(obj['Дата статуса']);
                obj['Амортизация'] = getValueDepreciation(obj['Амортизация']);
                return obj;
            });
            
            stringify(resultObjects, { header: true })
                .pipe(res);

        } catch (e) {
            restAPIerror(res, e);
        }
    });
};



