import socketIOClient from "socket.io-client";
import {URLSERVER} from '../../configuracion/configuracion'

export const iniciarSesion = (credenciales) => {
    return (dispatch, getState, Api) => {
        Api.iniciarSesion(credenciales).then((resultado) => {
            if (resultado.usuario) {
                if (resultado.admin) {
                    dispatch({ type: 'INICIAR_SESION', resultado });
                    Api.obtenerListaClientes().then((respuesta)=>{
                        dispatch({type: "CLIENTES", clientes: respuesta})
                    }).catch((error)=>{
                        console.log(error);
                    });
                } else {
                    const socket = socketIOClient(URLSERVER);
                    socket.on('connect', () => {
                        socket.emit('mi_correo', resultado.usuario.correo);
                    });
                    socket.on('recibido', (dato) => {
                        if (dato) {
                            dispatch({ type: 'INICIAR_SESION', resultado });
                            socket.on('consumoReal', (objeto) => {
                                console.log(objeto);
                                // dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes });
                                // dispatch({type:'COSTO_U', costoU: respuesta.costoU});
                            });
                            Api.consultarConsumoReal(resultado.usuario.correo).then((respuesta) => {
                                dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes.consumoMes });
                                dispatch({type:'COSTO_U', costoU: respuesta.costoU});
                            }).catch((error) => {
                                console.log(error);
                            });
                            Api.consultarLimite(resultado.usuario.correo).then((respuesta)=>{
                                dispatch({ type: 'LIMITE', limite: respuesta.limite, tipoLimite: respuesta.tipoLimite });
                            }).catch((error)=>{
                                console.log(error);
                            });
                            
                        }
                    });
                }

            } else {
                dispatch({ type: 'INICIAR_SESION', resultado });
            }
        }).catch((error) => {
            dispatch({ type: 'INICIAR_SESION_ERROR', error });
        });
    }
}

export const cerrarAlerta = () => {
    return (dispatch, getState) => {
        dispatch({ type: 'CERRAR_ALERTA' });
    }
}

export const cerrarSesion = (correo, admin) => {
    return (dispatch, getState, Api) => {
        Api.cerrarSesion().then((resultado) => {
            if (resultado.estado) {
                if (admin) {
                    dispatch({ type: 'CERRAR_SESION' });
                } else {
                    const socket = socketIOClient(URLSERVER);
                    socket.emit('salir', correo);
                    socket.on('recibido', () => {
                        dispatch({ type: 'CERRAR_SESION' });
                    });
                }
            }
        })
    }
}

export const autenticacionLista = (usuario, admin) => {
    return (dispatch, getState) => {
        dispatch({ type: 'AUTENTICACION_LISTA', usuario, admin });
    }
}