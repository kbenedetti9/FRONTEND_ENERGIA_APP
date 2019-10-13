export const iniciarSesion = (credenciales) => {
    return (dispatch, getState, Api ) => {
        Api.iniciarSesion(credenciales).then((resultado)=>{
            dispatch({type: 'INICIAR_SESION', resultado});
        }).catch((error)=>{
            dispatch({type: 'INICIAR_SESION_ERROR', error});
        });
    }
}

export const cerrarSesion = () => {
    return (dispatch, getState, Api ) => {
        Api.cerrarSesion().then((resultado)=>{
            if(resultado.estado){
                dispatch({type: 'CERRAR_SESION'});
            }
        })
    }
}

export const autenticacionLista = (usuario) => {
    return (dispatch, getState ) => {
        dispatch({type: 'AUTENTICACION_LISTA', usuario});
    }
}