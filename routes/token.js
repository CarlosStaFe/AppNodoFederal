const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

router.post('/api/consultar', async (req, res) => {
    const { tipo, documento } = req.body;

    try {
        // 1. Obtener el token
        const tokenResponse = await fetch(process.env.API_TOKEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: process.env.API_USER,
                password: process.env.API_PASSWORD
            })
        });

        if (!tokenResponse.ok) {
            return res.status(tokenResponse.status).json({ error: 'Error al obtener el token' });
        }

        const { access_token } = await tokenResponse.json();

        // 2. Consultar la API externa con el token
        let url = '';
        if (tipo === 'DNI') {
            url = `https://stgapi.agd-online.com/v1/person/byDni?dni=${documento}`;
        } else if (tipo === 'CUIL') {
            url = `https://stgapi.agd-online.com/v1/person/byCuil?cuil=${documento}`;
        } else {
            return res.status(400).json({ error: 'Tipo de documento no soportado' });
        }

        const apiResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({ error: 'Error en la consulta a la API externa' });
        }

        const datos = await apiResponse.json();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
    }
});

module.exports = router;