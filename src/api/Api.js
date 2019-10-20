import { URLSERVER } from '../configuracion/configuracion';

const Api = {};

Api.iniciarSesion = async (credenciales) => {

    let usuario = null;
    let mensaje = null;
    let admin = false;

    const resultado = await fetch(URLSERVER + '/iniciarSesion', {
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

    const resultado = await fetch(URLSERVER + '/cerrarSesion', {
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

    const resultado = await fetch(URLSERVER + '/estoyAutenticado', {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    return resultadoJson;
}

Api.actualizarContraseña = async (correo, contraseña) => {

    const resultado = await fetch(URLSERVER + '/cliente/' + correo, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ sesionP: true, contraseña }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    return resultadoJson;
}

Api.consultarConsumoReal = async (correo) => {
    let consumoMes = 0;
    let costoU = 0;
    const resultado = await fetch(URLSERVER + '/consumo/' + correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        consumoMes = resultadoJson.consumoMes;
        costoU = resultadoJson.costoU;
    }

    return { consumoMes, costoU };
}

Api.consultarLimite = async (correo) => {

    let limite = 0;
    let tipoLimite = null;

    const resultado = await fetch(URLSERVER + '/alerta/' + correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
    
    if (resultadoJson.estado) {
        limite = resultadoJson.alerta.limite;
        tipoLimite = resultadoJson.alerta.tipoLimite;
    }

    return { limite, tipoLimite };
}

Api.actualizarLimite = async (correo, limite, tipoLimite, primeraVez) => {

    let respuesta;

    if (primeraVez) {
        respuesta = await fetch(URLSERVER + '/alerta/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ correoCliente: correo, limite, tipoLimite }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
    } else {
        respuesta = await fetch(URLSERVER + '/alerta/' + correo, {
            method: 'PUT',
            body: JSON.stringify({  limite, tipoLimite }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
    }

    let resultadoJson = await respuesta.json();

    if(resultadoJson.estado){
        resultadoJson = {
            ...resultadoJson,
            limite,
            tipoLimite
        }
    }

    return resultadoJson;
}

Api.consultarHistorial = async (correo) => {

    let historial = null;

    const resultado = await fetch(URLSERVER + '/historial/' + correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        historial = resultadoJson.historial;
    }

    return historial;
}

export default Api;