// Este script se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        const tipo = document.getElementById('tipo').value;
        const documento = document.getElementById('documento').value;

        try {
            // Obtener el access_token desde el servidor
            const tokenResponse = await fetch('https://stgapi.agd-online.com/v1/account/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!tokenResponse.ok) {
                throw new Error(`Error al obtener el token: ${tokenResponse.status}`);
            }

            const { access_token } = await tokenResponse.json();

            // Realizar la consulta a la API usando el access_token
            const response = await fetch(`https://stgapi.agd-online.com/v1/person/byDni?dni=${documento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`, // Agregar el token en el encabezado
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la consulta: ${response.status}`);
            }

            const data = await response.json();
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-success">
                    <strong>Resultado:</strong> ${JSON.stringify(data)}
                </div>
            `;
            console.log(data); // Muestra la respuesta en la consola para depuración
        } catch (error) {
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    });
});