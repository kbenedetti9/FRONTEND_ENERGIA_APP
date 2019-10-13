
export const consultarConsumoReal = (correo) => {
    return (dispatch, getState, Api) => {
        Api.consultarConsumoReal(correo).then((consumoReal)=>{
            dispatch({type:'CONSUMO_REAL', consumoMes: consumoReal.consumoMes});
        }).catch((error)=>{
            console.log(error);
        });
    }
}