export const consultarConsumoReal = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarConsumoReal(correo).then((respuesta) => {
            dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes.consumoMes });
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