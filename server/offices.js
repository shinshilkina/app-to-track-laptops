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

    app.get('/offices/add', async (req, res) => {
        const {office, housing, type} = req.query;
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
    app.get('/offices/delete', async (req, res) => {
        const {id} = req.query;
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
    app.get('/offices/update', async (req, res) => {
        const {office, housing, type, id} = req.query;
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