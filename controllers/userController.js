const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');

//PROCEDIMIENTO PARA EL LOGIN DE USUARIOS
exports.login = async (req, res) => {
    try {
        const user = req.body.usuario;
        const pass = req.body.password;

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese Usuario y Password",
                alertIcon: "info",
                showConfirmButton: true,
                timer: 5000,
                ruta: "login"
            });
        } else {
            conexion.query('SELECT * FROM usuarios WHERE Usuario = ?', [user], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].Password))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Los datos ingresados son incorrectos.",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 5000,
                        ruta: "login"
                    });
                } else {
                    const id = results[0].id
                    const name = results[0].ApelNombre
                    const token = jwt.sign({ id: id, nombre: name }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    //Generamos el token sin fecha de expiracion
                    //const token = jwt.sign({id:id}, process.env.JWT_SECRETO
                    //console.log("TOKEN: " + token + " para el usuario: " + name)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'produccion'
                    };
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "LOGIN CORRECTO...!!!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1000,
                        ruta: ''
                    });
                };
            });
        };
    } catch (error) {
        console.log(error);
    };
};

//PROCEDIMIENTO PARA VERIFICAR LA COOKIE
exports.verificado = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM usuarios WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results || results.length === 0) {
                     return next();
                };
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login');
    };
};

//PROCEDIMIENTO PARA REGISTRAR USUARIOS
exports.registrar = async (req, res) => {
    try {
        const apelNombre = req.body.apelNombre;
        const telefono = req.body.telefono;
        const email = req.body.email;
        const nroNodo = parseInt(req.body.nronodo.substring(0, req.body.nronodo.indexOf('-')));
        const nombreNodo = req.body.nronodo;
        const rol = req.body.rol;
        let activo = req.body.activo
        if (activo == 'on') { activo = 1 } else { activo = 0 }
        const usuario = req.body.usuario;
        const password = req.body.password;
        var passHash = await bcryptjs.hash(password, 10);
        //console.log(passHash)
        conexion.query('INSERT INTO usuarios SET ?', { ApelNombre: apelNombre, Telefono: telefono, Email: email, NroNodo: nroNodo, NombreNodo: nombreNodo, Rol: rol, Activo: activo, Usuario: usuario, Password: passHash, UserRegistro: 'admin' }, (error, results) => {
            if (error) { console.log(error) };
            res.redirect('/usuarios');
        })
    } catch (error) {
        console.log(error);
    };
};

//PROCEDIMIENTO PARA SALIR DEL SISTEMA
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/login');
};

//PROCEDIMIENTO PARA HACER LA LISTA DE USUARIOS
exports.listar = (req, res) => {
    conexion.query('SELECT * FROM usuarios ORDER BY ApelNombre', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al listar los usuarios');
        } else {
            res.render('usuarios', { filas: results, user: req.user });
        }
    });
};

//PROCEDIMIENTO PARA MOSTRAR EL USUARIO SELECCIONADO
exports.editarUser = (req, res) => {
    return new Promise((resolve, reject) => {
        const { id } = req.params;
        conexion.query('SELECT * FROM usuarios WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                req.user = results[0];
                resolve(results[0]);
            }
        });
    });
};

//PROCEDIMIENTO PARA REGRABAR EL USUARIO SELECCIONADO
exports.modificar = async (req, res) => {
    const { id } = req.params;

    const apelNombre = req.body.apelNombre;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const nroNodo = parseInt(req.body.nronodo.substring(0, req.body.nronodo.indexOf('-')));
    const nombreNodo = req.body.nronodo;
    const rol = req.body.rol;
    let activo = req.body.activo
    if (req.body.activo == 1 || req.body.activo == "null") {
        req.body.activo = 1
    }else{
         req.body.activo = 0
    };
    const usuario = req.body.usuario;
    const password = req.body.password;
    var passHash = await bcryptjs.hash(password, 10);

    const newUser = { ApelNombre: apelNombre, Telefono: telefono, Email: email, NroNodo: nroNodo, NombreNodo: nombreNodo, Rol: rol, Activo: activo, Usuario: usuario, Password: passHash, UserRegistro: 'admin' };

    conexion.query('UPDATE usuarios SET ? WHERE id = ?', [ newUser, id ], (error, results) => {
        if (error) {
            console.log(error);
        }else{
            res.redirect('/usuarios');
        };
    });
};

//PROCEDIMIENTO PARA ELIMINAR EL USUARIO SELECCIONADO
exports.eliminar = (req, res) => {
    const { id } = req.params;
    conexion.query('DELETE FROM usuarios WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error al eliminar el usuario');
        } else {
            return res.redirect('/usuarios');
        }
    });
};
