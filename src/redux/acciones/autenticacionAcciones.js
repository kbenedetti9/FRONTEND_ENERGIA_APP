import socketIOClient from "socket.io-client";
import { URLSERVER } from '../../configuracion/configuracion';
import Push from 'push.js';

function onGranted() {
    console.log("Aceptada")
}

function onDenied() {
    console.log("Rechazada")
}

const imprimirNotificacion = (notificacion, simbol) => {

    const body = simbol === "$" ? `Limite definido: $${notificacion.limite}. \nConsumo actual: ${notificacion.consumo} kw/h. \nCosto: $${notificacion.costo}.` : `Limite definido: ${notificacion.limite} kw/h. \nConsumo actual: ${notificacion.consumo} kw/h. \nCosto: $${notificacion.costo}.`;

    Push.create(`${notificacion.mensaje} establecido.`, {
        body,
        timeout: 40000,
        onClick: function () {
            console.log(this);
        }
    });
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
                    // Api.consultarCostoUnitario().then((respuestasistema) => {
                    //     dispatch({ type: "COSTO_UNITARIO", costoUnitario: respuestasistema.costoUnitario, fechaIniCorte: respuestasistema.fechaIniCorte, fechaFinCorte: respuestasistema.fechaFinCorte });
                    // }).catch((error) => {
                    //     console.log(error);
                    // });
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
                               
                                dispatch({ type: 'CONSUMO_REAL', consumoMes: objeto.ConsumoReal.consumoMes, fechaConsumoInicial: objeto.ConsumoReal.fechaInicialCorte, fechaConsumoFinal: objeto.ConsumoReal.fechaFinalCorte });

                                dispatch({ type: 'COSTO_U', costoU: objeto.costoU });

                                Api.consultarHistorial(resultado.usuario.correo).then((respuesta) => {
                                    if (respuesta.length > 0) {
                                        dispatch({ type: 'HISTORIAL', historial: respuesta });
                                    } else {
                                        dispatch({ type: 'HISTORIAL', historial: null });
                                    }
                                }).catch((error) => {
                                    dispatch({ type: 'HISTORIAL_ERROR', error: error });
                                });

                                Api.consultarAlerta(resultado.usuario.correo).then((respuesta) => {
                                    dispatch({ type: 'ALERTA', Alerta: respuesta, consultaAlerta: true });
                                }).catch((error) => {
                                    dispatch({ type: 'ALERTA_ERROR', error: error, consultaAlerta: true });
                                });
                            });

                            socket.on('limiteKwh', (notificacion) => {
                                imprimirNotificacion(notificacion, "kw/h");
                            });

                            socket.on('limiteCosto', (notificacion) => {
                                imprimirNotificacion(notificacion, "$");
                            });

                            Api.consultarConsumoReal(resultado.usuario.correo).then((respuesta) => {
                                dispatch({ type: 'CONSUMO_REAL', consumoMes: respuesta.consumoMes, fechaConsumoInicial: respuesta.fechaConsumoInicial, fechaConsumoFinal: respuesta.fechaConsumoFinal });
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
                                    dispatch({ type: 'HISTORIAL', historial: respuesta });
                                } else {
                                    dispatch({ type: 'HISTORIAL', historial: null });
                                }
                            }).catch((error) => {
                                dispatch({ type: 'HISTORIAL_ERROR', error: error });
                            });

                            Api.consultarAlerta(resultado.usuario.correo).then((respuesta) => {
                                dispatch({ type: 'ALERTA', Alerta: respuesta, consultaAlerta: true });
                            }).catch((error) => {
                                dispatch({ type: 'ALERTA_ERROR', error: error, consultaAlerta: true });
                            });

                            Api.consultarCostoUnitario().then((respuestasistema)=>{
                                dispatch({ type: "COSTO_UNITARIO", costoUnitario: respuestasistema.costoUnitario, fechaIniCorte: respuestasistema.fechaIniCorte, fechaFinCorte: respuestasistema.fechaFinCorte })
                            }).catch((error) => {
                                console.log(error);
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

export const actualizarSocket = (correo) => {
    return (dispatch, getState, Api) => {
        const socket = socketIOClient(URLSERVER);
        socket.emit('actualizarSocket', correo);
        socket.on('recibido', () => {
            socket.on('consumoReal', (objeto) => {
                console.log(objeto);
                
                dispatch({ type: 'CONSUMO_REAL', consumoMes: objeto.ConsumoReal.consumoMes, fechaConsumoInicial: objeto.ConsumoReal.fechaInicialCorte, fechaConsumoFinal: objeto.ConsumoReal.fechaFinalCorte });
                
                dispatch({ type: 'COSTO_U', costoU: objeto.costoU });
                
                Api.consultarHistorial(correo).then((respuesta) => {
                    if (respuesta.length > 0) {
                        dispatch({ type: 'HISTORIAL', historial: respuesta });
                    } else {
                        dispatch({ type: 'HISTORIAL', historial: null });
                    }
                }).catch((error) => {
                    dispatch({ type: 'HISTORIAL_ERROR', error: error });
                });

                Api.consultarAlerta(correo).then((respuesta) => {
                    dispatch({ type: 'ALERTA', Alerta: respuesta, consultaAlerta: true });
                }).catch((error) => {
                    dispatch({ type: 'ALERTA_ERROR', error: error, consultaAlerta: true });
                });
            });

            socket.on('limiteKwh', (notificacion) => {
                imprimirNotificacion(notificacion, "kw/h");
            });

            socket.on('limiteCosto', (notificacion) => {
                imprimirNotificacion(notificacion, "$");
            });
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
                    window.location.reload();
                    dispatch({ type: 'CERRAR_SESION' });
                    dispatch({ type: 'REINICIAR_ESTADOS' });
                    dispatch({ type: 'CERRANDO_SESION_FIN' });
                    window.location.reload();
                } else {
                    const socket = socketIOClient(URLSERVER);
                    socket.emit('salir', correo);
                    socket.on('recibido', () => {
                        window.location.reload();
                        dispatch({ type: 'CERRAR_SESION' });
                        dispatch({ type: 'REINICIAR_ESTADOS' });
                        dispatch({ type: 'CERRANDO_SESION_FIN' });
                    });
                }
            }
        }).catch((error) => {
            dispatch({ type: 'CERRANDO_SESION_FIN' });
        });
    }
}

export const autenticacionLista = (usuario, admin) => {
    return (dispatch, getState) => {
        dispatch({ type: 'AUTENTICACION_LISTA', usuario, admin });
    }
}