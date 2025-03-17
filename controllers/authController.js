const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');

//PROCEDIMIENTO PARA REGISTRAR USUARIOS
exports.register = async (req, res) => {
    try {
        const apelNombre = req.body.apelNombre
        const telefono = req.body.telefono
        const email = req.body.email
        const nroNodo = parseInt(req.body.nronodo.substring(0, req.body.nronodo.indexOf('-')));
        const nombreNodo = req.body.nronodo;
        const rol = req.body.rol;
        let activo = req.body.activo
        if (activo == 'on') { activo = 1 } else { activo = 0 }
        const usuario = req.body.usuario
        const password = req.body.password
        let passHash = await bcryptjs.hash(password, 10)

        conexion.query('INSERT INTO usuarios SET ?', { ApelNombre: apelNombre, Telefono: telefono, Email: email, NroNodo: nroNodo, NombreNodo: nombreNodo, Rol: rol, Activo: activo, Usuario: usuario, Password: passHash, UserRegistro: 'admin'  }, (error, results) => {
            if (error) { console.log(error) }
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }
};

//PROCEDIMIENTO PARA EL LOGIN DE USUARIOS
exports.login = async (req, res) => {
    try {
        const user = req.body.usuario
        const pass = req.body.password

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese Usuario y Password",
                alertIcon: "info",
                showConfirmButton: true,
                timer: 5000,
                ruta: "login"
            })
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
                    })
                } else {
                    const id = results[0].id
                    const name = results[0].ApelNombre
                    const token = jwt.sign({ id: id, nombre: name }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //Generamos el token sin fecha de expiracion
                    //const token = jwt.sign({id:id}, process.env.JWT_SECRETO
                    //console.log("TOKEN: " + token + " para el usuario: " + name)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'produccion'
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "LOGIN CORRECTO...!!!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1000,
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.verificado = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usuarios WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                //console.log(req.user)
                //console.log(decodificada)
                //console.log(req.cookies.jwt)
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}
