const conexion = require('../database/db');

//PROCEDIMIENTO PARA MOSTRAR LAS LOCALIDADES
exports.getLocalidades = async (req, res) => {
    const { idProv } = req.params;

    conexion.query('SELECT id_Local, Localidad FROM localidades WHERE id_Prov = ? ORDER BY Localidad', [idProv], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al obtener las localidades');
        } else {
            res.json(results);
        };
    });
};

//PROCEDIMIENTO PARA MOSTRAR LOS CÓDIGOS POSTALES
exports.getCodigos = async (req, res) => {
    const { idLocal } = req.params;

    conexion.query('SELECT CodPostal FROM localidades WHERE id_Local = ? ORDER BY CodPostal', [idLocal], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al obtener los códigos postales');
        } else {
            res.json(results);
        };
    });
};
