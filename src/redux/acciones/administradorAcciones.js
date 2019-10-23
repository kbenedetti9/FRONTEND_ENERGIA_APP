export const obtenerListaClientes = () => {
    return (dispatch, getState, Api) => {
        Api.obtenerListaClientes().then((respuesta) => {
            dispatch({ type: "CLIENTES", clientes: respuesta })
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const recuperarContrasena = (correo, contraseña) => {
    return (dispatch, getState, Api) => {
        Api.recuperarContrasena(correo, contraseña).then((respuesta) => {
            dispatch({ type: "RECUPERAR_CONTRASENA", mensaje: respuesta.mensaje, variante: respuesta.variante });
        }).catch((error) => {
            console.log(error);
        });
    }
}

// export const actualizarUsuario = (usuario, correo, id_medidor)=>{
//     return(dispatch,getState,Api)=>{
//         Api.actualizarUsuario(usuario,correo, id_medidor).then((respuesta)=>{
//             dispatch({type: "ACTUALIZAR_USUARIO",mensaje: respuesta.mensaje,variante: respuesta.variante});

//         }).catch((error =>{
//             console.log(error);
//         } ));
//     }
// }