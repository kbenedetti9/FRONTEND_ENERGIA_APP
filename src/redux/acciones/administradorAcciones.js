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

export const consultarCostoUnitario = () => {//Realmente es una consulta al sistema mas no al costo unitario
    return (dispatch, getState, Api) => {
        Api.consultarCostoUnitario().then((respuestasistema)=>{
            dispatch({ type: "COSTO_UNITARIO", costoUnitario: respuestasistema.costoUnitario, fechaIniCorte: respuestasistema.fechaIniCorte, fechaFinCorte: respuestasistema.fechaFinCorte })
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const cerrarSesionUsuario = (correo) => {
    return (dispatch, getState, Api) => {
        Api.cerrarSesionUsuario(correo).then((respuesta)=>{
            dispatch({ type: "CERRAR_SESION_USUARIO", mensaje: respuesta.mensaje, variante: respuesta.variante });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const actualizarUsuario = (correo, id_medidor) => {
    return (dispatch, getState, Api) => {
        Api.actualizarUsuario(correo, id_medidor).then((respuesta) => {
            if(respuesta.estado){//Actualización con exito
                dispatch({ type: "ADMINISTRADOR_ACCION", mensaje: respuesta.mensaje, variante: respuesta.variante });
                Api.obtenerListaClientes().then((respuesta2) => {
                    dispatch({ type: "CLIENTES", clientes: respuesta2 })
                }).catch((error) => {
                    console.log(error);
                });
            }else{//Error al actualizar un usuario
                dispatch({ type: "ADMINISTRADOR_ACCION_ERROR", mensaje: respuesta.mensaje, variante: respuesta.variante });
            }
        }).catch((error => {
            dispatch({ type: "ADMINISTRADOR_ACCION_ERROR", error, variante: "danger" });
            console.log(error);
        }));
    }
}

export const crearUsuario = (correo, nombre, apellidos, id_medidor, cedula) => {
    return (dispatch, getState, Api) => {
        dispatch({ type: "CREANDO_CLIENTE"});
        Api.crearUsuario(correo, nombre, apellidos, id_medidor, cedula).then((respuesta) => {
            if(respuesta.estado){//creacion con exito
                dispatch({ type: "ADMINISTRADOR_ACCION", mensaje: respuesta.mensaje, variante: respuesta.variante });
                dispatch({ type: "CREANDO_CLIENTE_FIN"});
                Api.obtenerListaClientes().then((respuesta) => {
                    dispatch({ type: "CLIENTES", clientes: respuesta });
                }).catch((error) => {
                    console.log(error);
                });
            }else{//Error al crear un usuario
                dispatch({ type: "ADMINISTRADOR_ACCION_ERROR", mensaje: respuesta.mensaje, variante: respuesta.variante });
                dispatch({ type: "CREANDO_CLIENTE_FIN"});
            }
        }).catch((error => {
            dispatch({type: "ADMINISTRADOR_ACCION_ERROR", variante: "danger", mensaje: error});
            dispatch({ type: "CREANDO_CLIENTE_FIN"});
            console.log(error);
        }));
    }
}

export const eliminarUsuario = (correo) => {
    return (dispatch, getState, Api) => {
        Api.eliminarUsuario(correo).then((respuesta) => {
            if(respuesta.estado){//eliminacion con exito
                dispatch({ type: "ADMINISTRADOR_ACCION", mensaje: respuesta.mensaje, variante: respuesta.variante });
                Api.obtenerListaClientes().then((respuesta) => {
                    dispatch({ type: "CLIENTES", clientes: respuesta })
                }).catch((error) => {
                    console.log(error);
                });
            }else{//Error al eliminar un usuario
                dispatch({ type: "ADMINISTRADOR_ACCION_ERROR", mensaje: respuesta.mensaje, variante: respuesta.variante });
            }
        }).catch((error => {
            dispatch({type: "ADMINISTRADOR_ACCION_ERROR", variante: "danger", mensaje: error});
            console.log(error);
        }));
    }
}

export const actualizarCostoUnitario = (costoUnitario) => {
    return (dispatch, getState, Api) => {
        Api.actualizarCostoUnitario(costoUnitario).then((respuesta) => {
            if(respuesta.estado){//actualizacion con exito
                dispatch({ type: "ADMINISTRADOR_ACCION", mensaje: respuesta.mensaje, variante: respuesta.variante });
                dispatch({type:'COSTO_U', costoU: costoUnitario});
            }else{//Error al actualizar el costo unitario
                dispatch({ type: "ADMINISTRADOR_ACCION_ERROR", mensaje: respuesta.mensaje, variante: respuesta.variante });
            }
        }).catch((error => {
            dispatch({type: "ADMINISTRADOR_ACCION_ERROR", variante: "danger", mensaje: error});
            console.log(error);
        }));
    }
}

export const ocultarAlerta = () =>{
    return (dispatch) =>{
        dispatch({type: 'OCULTAR_MENSAJE'});
    }
}
