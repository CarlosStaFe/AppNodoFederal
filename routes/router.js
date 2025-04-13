const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const nodoController = require('../controllers/nodoController');
const socioController = require('../controllers/socioController');
const clienteController = require('../controllers/clienteController');
const localController = require('../controllers/localController');

//----- ROUTER DE LAS VISTAS -----
// ROUTER PARA EL LOGIN
router.get('/', userController.verificado, (req, res) => {
    res.render('menu', { user: req.user });
});
router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});


// ROUTER PARA LOS USUARIOS
router.get('/usuarios', userController.verificado, userController.listar, (req, res) => {
    res.render('usuarios', { filas: req.filas, user: req.user });
});
router.get('/createuser', userController.verificado, async (req, res) => {
    try {
        const nodosPromise = nodoController.listar(req, res);        
        const [nodosResult] = await Promise.all([nodosPromise]);
        res.render('createuser', { filas: req.filas, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar la página de creación de usuario');
    }
});
router.get('/edituser/:id', userController.verificado, async (req, res) => {
    try {
        const userPromise = userController.editarUser(req, res);
        const nodosPromise = nodoController.listar(req, res);
        const [userResult, nodosResult] = await Promise.all([userPromise, nodosPromise]);
        res.render('edituser', { user: req.user, filas: req.filas });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar la página de edición de usuario');
    }
});
router.get('/deleteuser/:id', userController.eliminar, (req, res) => {
    res.redirect('/usuarios');
});


// ROUTER PARA LOS NODOS
router.get('/nodos', userController.verificado, async (req, res) => {
    try {
        const nodosPromise = nodoController.listar(req, res);
        const [nodosResult] = await Promise.all([nodosPromise]);
        res.render('nodos', { filas: req.filas, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar la página de creación de usuario');
    }
});
router.get('/createnodo', userController.verificado, (req, res) => {
    res.render('createnodo', { user: req.user });
});
router.get('/editnodo/:id', userController.verificado, nodoController.editarNodo, (req, res) => {
    res.render('editnodo', { data: req.data, user: req.user });
});


// ROUTER PARA LOS SOCIOS
router.get('/socios', userController.verificado, socioController.listar, (req, res) => {
    res.render('socios', { filas: req.filas, user: req.user });
});
router.get('/createsocio', userController.verificado, async (req, res) => {
    try {
        const nodosPromise = nodoController.listar(req, res);        
        const [nodosResult] = await Promise.all([nodosPromise]);
        res.render('createsocio', { filas: req.filas, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar la página de creación de socio');
    }
});
router.get('/editsocio/:id', userController.verificado, async (req, res) => {
    try {
        const sociosPromise = socioController.editarSocio(req, res);
        const nodosPromise = nodoController.listar(req, res);
        const [socioResult, nodosResult] = await Promise.all([sociosPromise, nodosPromise]);
        res.render('editsocio', { data: req.data, filas: req.filas, user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar la página de edición de socio');
    }
});


// ROUTER PARA LOS CLIENTES
router.get('/clientes', userController.verificado, clienteController.listar, (req, res) => {
    res.render('clientes', { filas: req.filas, user: req.user });
});
router.get('/createcliente', userController.verificado, (req, res) => {
    res.render('createcliente', { user: req.user });
});
router.get('/editcliente/:id', userController.verificado, clienteController.editarCliente, (req, res) => {
    res.render('editcliente', { data: req.data, user: req.user });
});
router.get('/consultar', userController.verificado, (req, res) => {
    res.render('consultar', { user: req.user });
});
router.get('/operacion', userController.verificado, (req, res) => {
    res.render('operacion', { user: req.user });
});


// ROUTER PARA LOS METODOS DEL CONTROLLER
router.post('/login', userController.login);

router.post('/createuser', userController.registrar);
router.post('/edituser/:id', userController.modificar);

router.post('/createnodo', nodoController.registrar);
router.post('/editnodo/:id', nodoController.modificar);

router.post('/createsocio', socioController.registrar);
router.post('/editsocio/:id', socioController.modificar);

router.post('/createcliente', clienteController.registrar);
router.post('/editcliente/:id', clienteController.modificar);


// Ruta para obtener localidades según la provincia
router.get('/localidades/:idProv', localController.getLocalidades);
// Ruta para obtener códigos postales según la localidad
router.get('/codpostal/:idLocal', localController.getCodigos);
// Ruta para obtener el primer numero de nodo
router.get('/primerNodo', nodoController.primerNodo);
// Ruta para obtener el primer numero de socio
router.get('/primerSocio', socioController.primerSocio);

router.get('/logout', userController.logout);

module.exports = router;
