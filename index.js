const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const ejs = require('ejs')
const app = express();
const tokenRoutes = require('./routes/token');
const consultarRoutes = require('./routes/token');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', consultarRoutes);
app.use('/', tokenRoutes);

//SETEAMOS EL MOTOR DE PLANTILLAS
app.set('view engine', 'ejs');

//SETEAMOS LA CARPETA PUBLICA
app.use(express.static('public'));

//DEFINIMOS PARA PROCESAR LOS DATOS ENVIADOS DESDE LOS FORMS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//SETEAMOS LAS VARIABLES DE ENTORNO
dotenv.config({ path: './env/.env' });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//SETEAMOS PARA TRABAJAR CON COOKIES
app.use(cookieParser());

//LLAMAR AL ROUTER
app.use('/', require('./routes/router'));

app.use(tokenRoutes); // Asegúrate de usar las rutas de token.js

//PARA ELIMINAR EL CACHE Y QUE NO SE PUEDA VOLVER CON EL BOTON DE BACK LUEGO DEL LOGOUT
app.use(function (req, res, next) {
    if (!req.user) {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');}
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
