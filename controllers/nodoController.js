const conexion = require('../database/db');

//PROCEDIMIENTO PARA LISTAR LOS NODOS
exports.listar = (req, res) => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM nodos ORDER BY Nombre', (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                req.filas = results;
                resolve(results);
            }
        });
    });
};

//PROCEDIMIENTO PARA OBTENER EL PRIMER NÚMERO DE NODO LIBRE
exports.primerNodo = async (req, res) => {
    try {
        conexion.query('SELECT MAX(nronodo) AS maxNroNodo FROM nodos', (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al obtener el primer número de nodo libre');
            } else {
                const maxNroNodo = results[0].maxNroNodo || 0;
                const primerNodo = maxNroNodo + 1;
                res.json({ primerNodo });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener el primer número de nodo libre');
    }
};

//PROCEDIMIENTO PARA REGISTRAR LOS NODOS
exports.registrar = async (req, res) => {
    try {
        const nronodo = req.body.nronodo
        const nrofactura = req.body.nrofactura
        const nombre = req.body.nombre.toUpperCase()
        const domicilio = req.body.domicilio
        const codpostal = req.body.codpostal
        const idLocal = req.body.localidad
        const localidad = req.body.nombrelocal
        const idProv = req.body.provincia
        const provincia = req.body.nombreprov
        const telefono = req.body.telefono
        const email = req.body.email
        const cuit = req.body.cuit
        const tipo = req.body.tipo
        let activo = req.body.activo
        if (activo == 'on') { activo = 1 } else { activo = 0 }

        conexion.query('INSERT INTO nodos SET ?', { NroNodo: nronodo, NroFactura: nrofactura, Nombre: nombre, Domicilio: domicilio, CodPostal: codpostal, idLocal: idLocal, Localidad: localidad, idProv: idProv, Provincia: provincia, Telefono: telefono, Email: email, Cuit: cuit, Tipo: tipo, Activo: activo, UserRegistro: 'admin' }, (error, results) => {
            if (error) { console.log(error) }
            res.redirect('/nodos')
        })
    } catch (error) {
        console.log(error)
    }
};

//PROCEDIMIENTO PARA MOSTRAR EL NODO SELECCIONADO
exports.editarNodo = async (req, res) => {
    const { id } = req.params;

    conexion.query('SELECT * FROM nodos WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('editnodo', { data: results[0] });
        };
    });
};

//PROCEDIMIENTO PARA REGRABAR EL NODO SELECCIONADO
exports.modificar = async (req, res) => {
    const { id } = req.params;

    const nroNodo = req.body.nronodo
    const nroFactura = req.body.nrofactura
    const nombre = req.body.nombre.toUpperCase()
    const domicilio = req.body.domicilio
    const codpostal = req.body.codpostal
    const idLocal = req.body.localidad
    const localidad = req.body.nombrelocal
    const idProv = req.body.provincia
    const provincia = req.body.nombreprov
    const telefono = req.body.telefono
    const email = req.body.email
    const cuit = req.body.cuit
    const tipo = req.body.tipo
    let activo = req.body.activo

    if (activo == 1 || activo == "null") {
        activo = 1
    } else {
        activo = 0
    };

    const newNodo = {
        Nombre: nombre,
        Domicilio: domicilio,
        CodPostal: codpostal,
        idLocal: idLocal,
        Localidad: localidad,
        idProv: idProv,
        Provincia: provincia,
        Telefono: telefono,
        Email: email,
        Cuit: cuit,
        Tipo: tipo,
        Activo: activo
    };
    //console.log(newNodo);

    conexion.query('UPDATE nodos SET ? WHERE id = ?', [ newNodo , id ], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/nodos');
        };
    });
};
