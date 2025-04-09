const assert = require('assert');
const createError = require('http-errors');

const calculateCUIL = (document, gender) => {
    const HOMBRE = ['HOMBRE', 'M', '1', 'MALE', 'Masculino'];
    const MUJER = ['MUJER', 'F', '2', 'FEMALE', 'Femenino'];
    const SOCIEDAD = ['SOCIEDAD', 'S', 'SS', 'SOCIETY'];
    assert(document, createError.BadRequest());
    document = document.toString();
    assert(gender, createError.BadRequest());
    gender = gender.toUpperCase();
    assert(!isNaN(document), createError.BadRequest());
    assert([7, 8].includes(document.length), createError.BadRequest());
    assert(HOMBRE.includes(gender) || MUJER.includes(gender) || SOCIEDAD.includes(gender), createError.BadRequest());
    let AB, C;
    document = `${document.length === 7 ? '0' : ''}${document}`;
    if (HOMBRE.includes(gender)) {
        AB = '20';
    } else if (MUJER.includes(gender)) {
        AB = '27';
    } else {
        AB = '30';
    }
    const multiplicadores = [3, 2, 7, 6, 5, 4, 3, 2];
    let calculo = ((parseInt(AB.charAt(0)) * 5) + (parseInt(AB.charAt(1)) * 4));
    for (let i = 0; i < 8; i++) {
        calculo += (parseInt(document.charAt(i)) * multiplicadores[i]);
    }
    let resto = (parseInt(calculo)) % 11;
    if (!SOCIEDAD.includes(gender) && resto == 1) {
        if (HOMBRE.includes(gender)) {
            C = 9;
        } else {
            C = 4;
        }
        AB = '23';
    } else if (resto === 0) {
        C = 0;
    } else {
        C = 11 - resto;
    }
    return `${AB}${document}${C}`;
}
module.exports = {
    calculateCUIL
}



function validarCuit(cuit) {

    if (cuit.length != 11) {
        return false;
    }

    var acumulado = 0;
    var digitos = cuit.split("");
    var digito = digitos.pop();

    for (var i = 0; i < digitos.length; i++) {
        acumulado += digitos[9 - i] * (2 + (i % 6));
    }

    var verif = 11 - (acumulado % 11);
    if (verif == 11) {
        verif = 0;
    } else if (verif == 10) {
        verif = 9;
    }

    return digito == verif;
}
