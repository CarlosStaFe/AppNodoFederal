const assert = require('assert');
const createError = require('http-errors');
/*
  Receive a dni and gender 'M' or 'F' and return his cuil.
  Params
    document : number -> dni
    gender : string
  Returns
    string -> cuil
*/
const calculateCUIL = (document, gender)=>{
  const HOMBRE   = ['HOMBRE', 'M','1', 'MALE', 'Masculino'];
  const MUJER    = ['MUJER', 'F','2', 'FEMALE', 'Femenino'];
  const SOCIEDAD = ['SOCIEDAD', 'S', 'SS', 'SOCIETY'];
  assert(document,createError.BadRequest());
  document = document.toString();
  assert(gender,createError.BadRequest());
  gender   = gender.toUpperCase();
  assert(!isNaN(document),createError.BadRequest());
  assert([7,8].includes(document.length),createError.BadRequest());
  assert(HOMBRE.includes(gender) || MUJER.includes(gender) || SOCIEDAD.includes(gender),createError.BadRequest());
  let AB,C;
  document = `${document.length===7 ? '0' : ''}${document}`;
  if(HOMBRE.includes(gender)) {
      AB = '20';
  } else if(MUJER.includes(gender)) {
      AB = '27';
  } else {
      AB = '30';
  }
  const multiplicadores = [3, 2, 7, 6, 5, 4, 3, 2];
  let calculo = ((parseInt(AB.charAt(0)) * 5) + (parseInt(AB.charAt(1)) * 4));
  for(let i=0;i<8;i++) {
      calculo += (parseInt(document.charAt(i)) * multiplicadores[i]);
  }
  let resto = (parseInt(calculo)) % 11;
  if( !SOCIEDAD.includes(gender) && resto==1){
      if(HOMBRE.includes(gender)){
          C = 9;
      } else {
          C = 4;
      }
      AB = '23';
  } else if(resto === 0){
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
 
    if(cuit.length != 11) {
        return false;
    }

    var acumulado   = 0;
    var digitos     = cuit.split("");
    var digito      = digitos.pop();

    for(var i = 0; i < digitos.length; i++) {
        acumulado += digitos[9 - i] * (2 + (i % 6));
    }

    var verif = 11 - (acumulado % 11);
    if(verif == 11) {
        verif = 0;
    } else if(verif == 10) {
        verif = 9;
    }

    return digito == verif;
}


<script type="text/javascript">
    function esCUITValida(inputValor) {
    inputString = inputValor.toString()
    if (inputString.length == 11) {
        var Caracters_1_2 = inputString.charAt(0) + inputString.charAt(1)
        if (Caracters_1_2 == "20" || Caracters_1_2 == "23" || Caracters_1_2 == "24" || Caracters_1_2 == "27" || Caracters_1_2 == "30" || Caracters_1_2 == "33" || Caracters_1_2 == "34") {
            var Count = inputString.charAt(0) * 5 + inputString.charAt(1) * 4 + inputString.charAt(2) * 3 + inputString.charAt(3) * 2 + inputString.charAt(4) * 7 + inputString.charAt(5) * 6 + inputString.charAt(6) * 5 + inputString.charAt(7) * 4 + inputString.charAt(8) * 3 + inputString.charAt(9) * 2 + inputString.charAt(10) * 1
            Division = Count / 11;
            if (Division == Math.floor(Division)) {
                return true
            }
        }
    }
    return false
}


<script type="text/javascript">
function CPcuitValido(cuit) {
  var vec="new" Array(10);
  esCuit=false;
  cuit_rearmado="";
  errors = ''
  for (i=0; i < cuit.length; i++) {   
      caracter=cuit.charAt( i);
      if ( caracter.charCodeAt(0) >= 48 && caracter.charCodeAt(0) <= 57 )     {
          cuit_rearmado +=caracter;
      }
  }
  cuit=cuit_rearmado;
  if ( cuit.length != 11) {  // si to estan todos los digitos
      esCuit=false;
      errors = 'Cuit <11 ';
      alert( "CUIT Menor a 11 Caracteres" );
  } else {
      x=i=dv=0;
      // Multiplico los dígitos.
      vec[0] = cuit.charAt(  0) * 5;
      vec[1] = cuit.charAt(  1) * 4;
      vec[2] = cuit.charAt(  2) * 3;
      vec[3] = cuit.charAt(  3) * 2;
      vec[4] = cuit.charAt(  4) * 7;
      vec[5] = cuit.charAt(  5) * 6;
      vec[6] = cuit.charAt(  6) * 5;
      vec[7] = cuit.charAt(  7) * 4;
      vec[8] = cuit.charAt(  8) * 3;
      vec[9] = cuit.charAt(  9) * 2;
                  
      // Suma cada uno de los resultado.
      for( i = 0;i<=9; i++) {
          x += vec[i];
      }
      dv = (11 - (x % 11)) % 11;
      if ( dv == cuit.charAt( 10) ) {
          esCuit=true;
      }
  }
  if ( !esCuit ) {
      alert( "CUIT Invalido" );
      document.frmClientes.cuit.focus();
      errors = 'Cuit Invalido ';
  }
document.MM_returnValue1 = (errors == '');
}
 