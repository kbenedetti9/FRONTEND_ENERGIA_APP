export const consultarConsumoReal = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarConsumoReal(correo).then((respuesta) => {
            dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes, fechaConsumoInicial: respuesta.fechaConsumoInicial, fechaConsumoFinal: respuesta.fechaConsumoFinal });
            dispatch({ type: 'COSTO_U', costoU: respuesta.costoU });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const consultarLimite = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarLimite(correo).then((respuesta) => {
            dispatch({ type: 'LIMITE', limite: respuesta.limite, tipoLimite: respuesta.tipoLimite });
        }).catch((error) => {
            console.log(error);
        })
    }
}

export const consultarAlerta = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarAlerta(correo).then((respuesta) => {
            dispatch({ type: 'ALERTA', Alerta: respuesta, consultaAlerta: true });
        }).catch((error) => {
            dispatch({ type: 'ALERTA_ERROR', error: error, consultaAlerta: true });
        });
    }
}

export const actualizarContraseña = (correo, contraseña, usuario) => {
    return (dispatch, getState, Api) => {
        Api.actualizarContraseña(correo, contraseña).then((resultado) => {
            if (resultado.estado) {
                dispatch({ type: 'ACTUALIZAR_USUARIO', usuario });
            } else {
                console.log("Error")
                console.log(resultado)
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const actualizarLimite = (correo, limite, tipoLimite, primeraVez) => {
    return (dispatch, getState, Api) => {
        Api.actualizarLimite(correo, limite, tipoLimite, primeraVez).then((resultado) => {
            dispatch({ type: 'LIMITE', limite: resultado.limite, tipoLimite: resultado.tipoLimite });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const actualizarDatos = (correo, sesionP, cambiarContrasena, contrasena, contrasenaNueva, telefono, usuario) => {
    return (dispatch, getState, Api) => {
        Api.actualizarDatos(correo, sesionP, cambiarContrasena, contrasena, contrasenaNueva, telefono, usuario).then((resultado) => {
            dispatch({ type: 'ACTUALIZAR_USUARIO', usuario: resultado.usuario, mensaje: resultado.mensaje, variante: resultado.variante });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const consultarHistorial = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarHistorial(correo).then((respuesta)=>{
            if(respuesta.length > 0){
                dispatch({ type: 'HISTORIAL', historial: respuesta });
            }else{
                dispatch({ type: 'HISTORIAL', historial: null });
            }
        }).catch((error) => {
            dispatch({ type: 'HISTORIAL_ERROR', error: error });
        });
    }
}