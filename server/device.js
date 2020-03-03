module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/device/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM device'
            );
            res.status(200).send({
                rows
            });
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.post('/device/add', async (req, res) => {
        const {id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
            write_off_date, description, OS} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO device(office, housing, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/device/delete', async (req, res) => {
        const {id} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM device WHERE id_device = ?;`,
                [id]
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
            write_off_date, description, OS, id} = req.body;
        try {
            await mysqlQuery(
                `UPDATE device SET id_employee = ?, 
                    id_office = ?, manufacturer = ?, model = ?,
                    serial_number = ?, inventory_number = ?,
                    date_added = ?, write_off_date = ?, 
                    description = ?, OS = ? 
                    WHERE id_device = ?;`,
                [id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
                    write_off_date, description, OS, id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res,e);
        }
    });
};