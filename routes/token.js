const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config(); // Cargar variables de entorno desde .env

// Ruta para obtener el access_token usando el refresh_token
router.post('/api/token', async (req, res) => {
    try {
        const refreshToken = process.env.REFRESH_TOKEN; // Obtener el refresh_token desde .env

        const response = await fetch('https://stgapi.agd-online.com/v1/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el token: ${response.status}`);
        }

        const data = await response.json();
        res.json({ access_token: data.access_token }); // Devolver el nuevo access_token al cliente
    } catch (error) {
        console.error('Error al obtener el token:', error.message);
        res.status(500).json({ error: 'Error al obtener el token' });
    }
});

module.exports = router;