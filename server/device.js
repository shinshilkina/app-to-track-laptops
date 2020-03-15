module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/device/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.post('/device/list/id', async (req, res) => {
        const {id_device} = req.body;
        try{
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
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT manufacturer FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.get('/device/list/model', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT model FROM device'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.get('/device/list/inventory_number', async (req, res) => {
        try{
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
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/device/delete', async (req, res) => {
        const {id_device} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM device WHERE id_device = ?;`,
                [id_device]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
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
        }catch (e){
            restAPIerror(res,e);
        }
    });
};