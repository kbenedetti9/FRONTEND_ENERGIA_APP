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
    let fechaConsumoInicial = null;
    let fechaConsumoFinal = null;

    const resultado = await fetch(URLSERVER + '/consumo/' + correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
    if (resultadoJson.estado) {
        consumoMes = resultadoJson.consumoMes.consumoMes;
        costoU = resultadoJson.costoU;
        fechaConsumoInicial = resultadoJson.consumoMes.fechaInicialCorte;
        fechaConsumoFinal = resultadoJson.consumoMes.fechaFinalCorte;
    }

    return { consumoMes, costoU, fechaConsumoInicial, fechaConsumoFinal };
}

Api.consultarAlerta = async (correo) => {

    let Alerta = null;

    const resultado = await fetch(URLSERVER + '/alerta/' + correo, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if(resultadoJson.estado){
        Alerta = resultadoJson.alerta;
    }

    return Alerta;
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
            body: JSON.stringify({ limite, tipoLimite }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        });
    }

    let resultadoJson = await respuesta.json();

    if (resultadoJson.estado) {
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

Api.actualizarDatos = async (correo, sesionP, cambiarContrasena, contrasena, contrasenaNueva, telefono, usuario) => {

    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + '/cliente/' + usuario.correo, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ sesionP, cambiarContrasena, contrasena, contrasenaNueva, correo, telefono }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        mensaje = "Actualización realizada con exito.";
        variante = "success";
        usuario.telefono = +telefono;
    } else {
        mensaje = "No se logró realizar la actualización";
        variante = "danger";
    }

    return { usuario, mensaje, variante };

}

Api.obtenerListaClientes = async () => {

    let listaCliente = [];

    const resultado = await fetch(URLSERVER + "/clientes", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });
    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        listaCliente = resultadoJson.clientes
    }

    return listaCliente;
}

Api.recuperarContrasena = async (correo, contraseña) => {

    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/cliente/" + correo, {
        method: 'PUT',
        body: JSON.stringify({ mod: "modA1", contraseña }),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        mensaje = "Contraseña reestablecida con exito.";
        variante = "success";
    }

    return { mensaje, variante };
}

Api.actualizarUsuario = async (correo, id_medidor) => {

    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/cliente/" + correo, {
        method: 'PUT',
        body: JSON.stringify({ id_medidor, mod: "modA2" }),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        mensaje = "Actualización realizada con exito.";
        variante = "success";
    } else {
        mensaje = "No se logró realizar la actualización";
        variante = "danger";
    }

    return {mensaje, variante, estado: resultadoJson.estado };

}

Api.crearUsuario = async (correo, nombre, apellidos, id_medidor, cedula) => {
    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/cliente/", {
        method: 'POST',
        body: JSON.stringify({ correo, nombre, apellidos, id_medidor, cedula }),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        mensaje = "Nuevo usuario creado con exito.";
        variante = "success";
    } else {
        mensaje = "No se logró realizar el registro del usuario";
        variante = "danger";
    }

    return { mensaje, variante, estado: resultadoJson.estado };
}

Api.eliminarUsuario = async (correo) => {
    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/cliente/" + correo, {
        method: 'DELETE',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if (resultadoJson.estado) {
        mensaje = "Usuario eliminado con exito.";
        variante = "success";
    } else {
        mensaje = "No se logró realizar la eliminación del usuario";
        variante = "danger";
    }

    return { mensaje, variante, estado: resultadoJson.estado };
}

Api.actualizarCostoUnitario = async (costoUnitario) => {
    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/sistema", {
        method: 'PUT',
        credentials: "include",
        body: JSON.stringify({ costoUnitario }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
    console.log(resultadoJson)
    if (resultadoJson.estado) {
        mensaje = "Costo unitario actualizado con exito.";
        variante = "success";
    } else {
        mensaje = "No se logró realizar la actualizacion del costo unitario";
        variante = "danger";
    }

    return { mensaje, variante, estado: resultadoJson.estado };
}

Api.consultarCostoUnitario = async () => {

    let costoUnitario = 0;
    let fechaIniCorte = null;
    let fechaFinCorte = null;
    let estado = false;

    const resultado = await fetch(URLSERVER + "/sistema", {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
    
    if(resultadoJson.estado){
        if(resultadoJson.sistema){
            costoUnitario = resultadoJson.sistema.costoUnitario;
            fechaIniCorte = resultadoJson.sistema.fechaInicialPeriodo;
            fechaFinCorte = resultadoJson.sistema.fechaFinalPeriodo;
            estado = true;
        }
    }
    return {costoUnitario, fechaIniCorte, fechaFinCorte, estado};
}

Api.guardarFechaPeriodo = async (fechaIni, fechaFin) => {

    const resultado = await fetch(URLSERVER + "/sistema/fechaPeriodo", {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ fechaIni, fechaFin }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
   
    return resultadoJson;
}

Api.guardarProxFechaPeriodo = async (fechaIni, fechaFin) => {

    const resultado = await fetch(URLSERVER + "/sistema/fechaProxPeriodo", {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ fechaIni, fechaFin }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();
   
    return resultadoJson;
}

Api.cerrarSesionUsuario = async (correo) => {

    let mensaje = null;
    let variante = null;

    const resultado = await fetch(URLSERVER + "/administrador/" + correo , {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json'
        }
    });

    const resultadoJson = await resultado.json();

    if(resultadoJson.estado){
        mensaje = resultadoJson.mensaje;
        variante = "success";
    }else{
        mensaje = resultadoJson.mensaje;
        variante = "warning";
    }
    
    return {mensaje, variante};
}

export default Api;