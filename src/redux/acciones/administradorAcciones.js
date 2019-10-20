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