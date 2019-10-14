export const consultarConsumoReal = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarConsumoReal(correo).then((consumoMes)=>{
            dispatch({type:'CONSUMO_REAL', consumoMes});
        }).catch((error)=>{
            console.log(error);
        });
    }
}

export const actualizarContraseña = (correo) => {
    return (dispatch, getState, Api) => {
        Api.actualizarContraseña(correo).then((resultado)=>{
            console.log(resultado)
            //dispatch({type:'ACTUALIZAR_USUARIO', usuario});
        }).catch((error)=>{
            console.log(error);
        });
    }
}