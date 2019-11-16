import socketIOClient from "socket.io-client";
import { URLSERVER } from '../../configuracion/configuracion';
import Push from 'push.js';

function onGranted() {
    console.log("Aceptada")
}

function onDenied() {
    console.log("Rechazada")
}

export const iniciarSesion = (credenciales) => {
    return (dispatch, getState, Api) => {
        dispatch({ type: 'INICIANDO_SESION' });
        Api.iniciarSesion(credenciales).then((resultado) => {
            if (resultado.usuario) {
                if (resultado.admin) {
                    dispatch({ type: 'INICIAR_SESION', resultado });
                    Api.obtenerListaClientes().then((respuesta) => {
                        dispatch({ type: "CLIENTES", clientes: respuesta })
                    }).catch((error) => {
                        console.log(error);
                    });
                    Api.consultarCostoUnitario().then((costoUnitario) => {
                        dispatch({ type: "COSTO_UNITARIO", costoUnitario })
                    }).catch((error) => {
                        console.log(error);
                    });
                    dispatch({ type: 'INICIANDO_SESION_FIN' });
                } else {
                    const socket = socketIOClient(URLSERVER);
                    socket.on('connect', () => {
                        socket.emit('mi_correo', resultado.usuario.correo);
                    });
                    socket.on('recibido', (dato) => {
                        if (dato) {

                            Push.Permission.request(onGranted, onDenied);
                            dispatch({ type: 'INICIAR_SESION', resultado });

                            socket.on('consumoReal', (objeto) => {
                                console.log(objeto);
                                dispatch({ type: 'CONSUMO_REAL', consumoMes: objeto.ultimoConsumo });
                                dispatch({ type: 'COSTO_U', costoU: objeto.costoU });
                                Api.consultarHistorial(resultado.usuario.correo).then((respuesta) => {
                                    if (respuesta.length > 0) {
                                        dispatch({ type: 'ULTIMO_HISTORIAL', historial: respuesta[respuesta.length - 1] });
                                    } else {
                                        dispatch({ type: 'ULTIMO_HISTORIAL', historial: null });
                                    }
                                }).catch((error)=>{
                                    dispatch({ type: 'ULTIMO_HISTORIAL_ERROR', error: error });
                                });
                            });

                            socket.on('limiteKwh', (notificacion) => {
                                Push.create(notificacion.mensaje, {
                                    body: "Limite: " + notificacion.limite + "/nConsumo: " + notificacion.consumo + "/nCosto: " + notificacion.costo,
                                    timeout: 10000,
                                    onClick: function () {
                                        console.log(this);
                                    }
                                });
                            });

                            socket.on('limiteCosto', (notificacion) => {
                                Push.create(notificacion.mensaje, {
                                    body: "Limite: " + notificacion.limite + "/nConsumo: " + notificacion.consumo + "/nCosto: " + notificacion.costo,
                                    timeout: 10000,
                                    onClick: function () {
                                        console.log(this);
                                    }
                                });
                            });

                            Api.consultarConsumoReal(resultado.usuario.correo).then((respuesta) => {
                                dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes });
                                dispatch({ type: 'COSTO_U', costoU: respuesta.costoU });
                            }).catch((error) => {
                                console.log(error);
                            });
                            Api.consultarLimite(resultado.usuario.correo).then((respuesta) => {
                                dispatch({ type: 'LIMITE', limite: respuesta.limite, tipoLimite: respuesta.tipoLimite });
                            }).catch((error) => {
                                console.log(error);
                            });
                            Api.consultarHistorial(resultado.usuario.correo).then((respuesta) => {
                                if (respuesta.length > 0) {
                                    dispatch({ type: 'ULTIMO_HISTORIAL', historial: respuesta[respuesta.length - 1] });
                                } else {
                                    dispatch({ type: 'ULTIMO_HISTORIAL', historial: null });
                                }
                            }).catch((error)=>{
                                dispatch({ type: 'ULTIMO_HISTORIAL_ERROR', error: error });
                            });

                            dispatch({ type: 'INICIANDO_SESION_FIN' });
                        }
                    });
                }

            } else {
                dispatch({ type: 'INICIAR_SESION', resultado });
                dispatch({ type: 'INICIANDO_SESION_FIN' });
            }
        }).catch((error) => {
            dispatch({ type: 'INICIAR_SESION_ERROR', error });
            dispatch({ type: 'INICIANDO_SESION_FIN' });
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
        dispatch({ type: 'CERRANDO_SESION' });
        Api.cerrarSesion().then((resultado) => {
            if (resultado.estado) {
                if (admin) {
                    dispatch({ type: 'CERRAR_SESION' });
                    dispatch({ type: 'REINICIAR_ESTADOS' });
                    dispatch({ type: 'CERRANDO_SESION_FIN' });
                } else {
                    const socket = socketIOClient(URLSERVER);
                    socket.emit('salir', correo);
                    socket.on('recibido', () => {
                        dispatch({ type: 'CERRAR_SESION' });
                        dispatch({ type: 'REINICIAR_ESTADOS' });
                        dispatch({ type: 'CERRANDO_SESION_FIN' });
                    });
                }
            }
        }).catch((error)=>{
            dispatch({ type: 'CERRANDO_SESION_FIN' });
        });
    }
}

export const autenticacionLista = (usuario, admin) => {
    return (dispatch, getState) => {
        dispatch({ type: 'AUTENTICACION_LISTA', usuario, admin });
    }
}