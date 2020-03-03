module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/offices/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM offices'
            );
            res.status(200).send({
                rows
            });
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.post('/offices/add', async (req, res) => {
        const {office, housing, type} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO offices(office, housing, type) VALUES (?, ?, ?);`,
                [office, housing, type]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/offices/delete', async (req, res) => {
        const {id} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM offices WHERE id_office = ?;`,
                [id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/offices/update', async (req, res) => {
        const {office, housing, type, id} = req.body;
        try {
            await mysqlQuery(
                `UPDATE offices SET office = ?, 
                    housing = ?, type = ? 
                    WHERE id_office = ?;`,
                [office, housing, type, id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res,e);
        }
    });
};