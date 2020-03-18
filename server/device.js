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
        const {id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
            write_off_date, description, OS,status, depreciation, depreciation_lenght} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO device(id_employee, id_office, manufacturer, model, serial_number, inventory_number, 
                date_added, write_off_date, description, OS, status, depreciation, depreciation_lenght) 
                VALUES (?, ?, ?, ?, ?, ?, STR_TO_DATE(?,'%Y-%m-%d'), STR_TO_DATE(?,'%Y-%m-%d'), ?, ?, ?, ?, ?);`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS, status, depreciation, depreciation_lenght]
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
        const {id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
            write_off_date, description, OS,status, depreciation, depreciation_lenght, id_device} = req.body;
        try {
            await mysqlQuery(
                `UPDATE device SET id_employee = ?, 
                    id_office = ?, manufacturer = ?, model = ?,
                    serial_number = ?, inventory_number = ?,
                    date_added = ?, write_off_date = ?, 
                    description = ?, OS = ? ,status =? , depreciation = ?, 
                    depreciation_lenght = ?
                    WHERE id_device = ?;`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS,status, depreciation, depreciation_lenght, id_device]
            );
            res.status(200).send({
                success: true
            });
        } catch (e){
            restAPIerror(res,e);
        }
    });
};