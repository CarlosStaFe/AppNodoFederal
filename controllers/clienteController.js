const conexion = require('../database/db');

//PROCEDIMIENTO PARA LISTAR LOS CLIENTES
exports.listar = async (req, res) => {
    conexion.query('SELECT * FROM clientes ORDER BY ApelNombre', (error, results) => {
        if (error) {
            console.log(error);
        }else{
            res.render('clientes', { filas: results});
        };
    });
};

// PROCEDIMINETO PARA REGISTAR CLIENTES
exports.registrar = async (req, res) => {
    try {
        const apelNombre = req.body.apelnombre.toUpperCase();
        const fechaNac = req.body.fechanac;
        const sexo = req.body.sexo;
        const tipoDoc = req.body.tipodoc;
        const documento = req.body.documento;
        const cuil = req.body.cuil;
        const domicilio = req.body.domicilio;
        const codPostal = req.body.codpostal;
        const idLocal = req.body.localidad;
        const localidad = req.body.nombrelocal;
        const idProv = req.body.provincia;
        const provincia = req.body.nombreprov;
        const telefono = req.body.telefono;
        const email = req.body.email;
        const estado = req.body.estado;
        const fechaEst = req.body.fechaest;

        conexion.query('INSERT INTO clientes SET ?', { ApelNombre: apelNombre, FechaNac: fechaNac, Sexo: sexo, TipoDoc: tipoDoc, Documento: documento, Cuil: cuil , Domicilio: domicilio, CodPostal: codPostal, idLocal: idLocal, Localidad: localidad, idProv: idProv, Provincia: provincia, Telefono: telefono, Email: email, Estado: estado, FechaEst: fechaEst, UserRegistro: 'admin' }, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al registrar el cliente');
            } else {
                res.redirect('/clientes');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al registrar el cliente');
    }
};

// PROCEDIMIENTO PARA MOSTRAR LOS DATOS DEL CLIENTE SELECCIONADO
exports.editarCliente = (req, res) => {
    const { id } = req.params;

    conexion.query('SELECT * FROM clientes WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('editcliente', { data: results[0] });
        };
    });
};

//PROCEDIMIENTO PARA REGRABAR EL CLIENTE SELECCIONADO
exports.modificar = async (req, res) => {
    const { id } = req.params;

    const apelNombre = req.body.apelnombre.toUpperCase();
    const fechaNac = req.body.fechanac;
    const sexo = req.body.sexo;
    const tipoDoc = req.body.tipodoc;
    const documento = req.body.documento;
    const cuil = req.body.cuil;
    const domicilio = req.body.domicilio;
    const codPostal = req.body.codpostal;
    const idLocal = req.body.localidad;
    const localidad = req.body.nombrelocal;
    const idProv = req.body.provincia;
    const provincia = req.body.nombreprov;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const estado = req.body.estado;
    const fechaEst = req.body.fechaest;

    const newCliente = { ApelNombre: apelNombre, FechaNac: fechaNac, Sexo: sexo, TipoDoc: tipoDoc, Documento: documento, Cuil: cuil , Domicilio: domicilio, CodPostal: codPostal, idLocal: idLocal, Localidad: localidad, idProv: idProv, Provincia: provincia, Telefono: telefono, Email: email, Estado: estado, FechaEst: fechaEst, UserRegistro: 'admin' };

    conexion.query('UPDATE clientes SET ? WHERE id = ?', [ newCliente, id ], (error, results) => {
        if (error) {
            console.log(error);
        }else{
            res.redirect('/Clientes');
        };
    });
};
