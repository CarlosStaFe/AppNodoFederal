const conexion = require('../database/db');

// PROCEDIMIENTO PARA LISTAR LOS SOCIOS
exports.listar = (req, res) => {
    conexion.query('SELECT * FROM socios ORDER BY RazonSocial', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al listar los socios');
        } else {
            res.render('socios', { filas: results });
        }
    });
};

//PROCEDIMIENTO PARA OBTENER EL PRIMER NÚMERO DE SOCIO LIBRE
exports.primerSocio = async (req, res) => {
    try {
        conexion.query('SELECT MAX(NroSocio) AS maxNroSocio FROM socios', (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al obtener el primer número de socio libre');
            } else {
                const maxNroSocio = results[0].maxNroSocio || 0;
                const primerSocio = maxNroSocio + 1;
                res.json({ primerSocio });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener el primer número de socio libre');
    }
};

// PROCEDIMINETO PARA REGISTAR SOCIOS
exports.registrar = async (req, res) => {
    try {
        const nroNodo = parseInt(req.body.nronodo.substring(0, req.body.nronodo.indexOf('-')));
        const nodo = req.body.nronodo;
        const nroSocio = req.body.nroSocio;
        const razonSocial = req.body.razonSocial;
        const cuit = req.body.cuit;
        const tipo = req.body.tipo;
        const domicilio = req.body.domicilio;
        const codpostal = req.body.codpostal;
        const idLocal = req.body.localidad;
        const localidad = req.body.nombrelocal;
        const idProv = req.body.Provincia;
        const provincia = req.body.nombreprov;
        const telefono = req.body.telefono;
        const email = req.body.email;
        let activo = req.body.activo
        if (activo == 'on') { activo = 1 } else { activo = 0 }

        conexion.query('INSERT INTO socios SET ?', { NroNodo: nroNodo, Nodo: nodo, NroSocio: nroSocio, Cuit: cuit, RazonSocial: razonSocial, Domicilio: domicilio, CodPostal: codpostal, idLocal: idLocal, Localidad: localidad, idProv: idProv, Provincia: provincia, Telefono: telefono, Email: email, Tipo: tipo, Activo: activo, UserRegistro: 'admin' }, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al registrar el socio');
            } else {
                res.redirect('/socios');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al registrar el socio');
    }
};

// PROCEDIMIENTO PARA MOSTRAR LOS DATOS DEL SOCIO SELECCIONADO
exports.editarSocio = (req, res) => {
    return new Promise((resolve, reject) => {
        const { id } = req.params;

        conexion.query('SELECT * FROM socios WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                req.data = results[0];
                resolve(results[0]);
            }
        });
    });
};

//PROCEDIMIENTO PARA REGRABAR EL USUARIO SELECCIONADO
exports.modificar = async (req, res) => {
    const { id } = req.params;

    const nroNodo = parseInt(req.body.nronodo.substring(0, req.body.nronodo.indexOf('-')));
    const nodo = req.body.nronodo;
    const nroSocio = req.body.nroSocio;
    const razonSocial = req.body.razonsocial;
    const cuit = req.body.cuit;
    const tipo = req.body.tipo;
    const domicilio = req.body.domicilio;
    const codpostal = req.body.codpostal;
    const idLocal = req.body.localidad;
    const localidad = req.body.nombrelocal;
    const idProv = req.body.Provincia;
    const provincia = req.body.nombreprov;
    const telefono = req.body.telefono;
    const email = req.body.email;

    if (req.body.activo == 1 || req.body.activo == "null") {
        req.body.activo = 1
    }else{
         req.body.activo = 0
    };
    const activo = req.body.activo

    const newSocio = { NroNodo: nroNodo, Nodo: nodo, NroSocio: nroSocio, Cuit: cuit, RazonSocial: razonSocial, Domicilio: domicilio, CodPostal: codpostal, idLocal: idLocal, Localidad: localidad, idProv: idProv, Provincia: provincia, Telefono: telefono, Email: email, Tipo: tipo, Activo: activo, UserRegistro: 'admin'};

    conexion.query('UPDATE socios SET ? WHERE id = ?', [ newSocio, id ], (error, results) => {
        if (error) {
            console.log(error);
        }else{
            res.redirect('/Socios');
        };
    });
};