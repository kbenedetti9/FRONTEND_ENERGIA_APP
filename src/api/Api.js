import {URLSERVER} from '../configuracion/configuracion';

const Api = {};

Api.iniciarSesion = async (credenciales) => {

    let usuario = null;
    let mensaje = null;
    let admin = false;

    const resultado = await fetch(URLSERVER+'/iniciarSesion', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ correo: credenciales.correo, contraseña: credenciales.contraseña }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.Estado) {
        usuario = resultadoJson.usuario;
        admin = resultadoJson.admin;
    } else {
        mensaje = resultadoJson.mensaje;
    }
    return { usuario, mensaje, admin };
}

Api.cerrarSesion = async () => {

    const resultado = await fetch(URLSERVER+'/cerrarSesion', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    return resultadoJson;
}

Api.estoyAutenticado = async () => {

    const resultado = await fetch(URLSERVER+'/estoyAutenticado', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    return resultadoJson;
}

Api.consultarConsumoReal = async (correo) => {
    let consumoReal = null;
    const resultado = await fetch(URLSERVER+'/consumo/'+correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
    if(resultadoJson.estado){
        consumoReal = resultadoJson.consumoMes;
    }

    return consumoReal;
}

export default Api;