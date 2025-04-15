// OBTENER EL TOKEN DE ACCESO
async function obtenerToken(usuario, contraseña) {
    const url = 'https://api/v1/account/authenticate'; // Reemplaza con la URL de tu API
    const datos = {
        username: usuario,
        password: contraseña
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();
        console.log('Token obtenido:', resultado.token); // Reemplaza "token" con la clave correcta
        return resultado.token;
    } catch (error) {
        console.error('Error al obtener el token:', error);
        return null;
    }
}

// Ejemplo de uso
//obtenerToken('usuarioEjemplo', 'contraseñaEjemplo');

// OBTENER EL ACCESS_TOKEN CON EL REFRESH_TOKEN
async function tokenConRefresh(refreshToken) {
    const url = process.env.API_URL; // URL desde .env
    //const refreshToken = process.env.REFRESH_TOKEN; // Refresh token desde .env
    console.log('Refresh token:', refreshToken);
    
    const datos = new URLSearchParams({
        grant_type: 'refresh_token', // Tipo de grant
        refresh_token: refreshToken  // Refresh token completo
    });

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            //body: datos.toString() // Convertir datos a formato x-www-form-urlencoded
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status}`);
        }

        const { access_token } = await respuesta.json();
        return access_token; // Devuelve el access_token
    } catch (error) {
        console.error('Error al obtener el token con refresh token:', error);
        return null;
    }
}

// Ejemplo de uso
//tokenConRefresh('refreshTokenEjemplo');