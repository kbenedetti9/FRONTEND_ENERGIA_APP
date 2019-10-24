const initState = {
    usuario: null,
    mensaje: null,
    variante: null,
    admin: false,
    autenticacionLista: false
}

const autenticacionReducer = (state = initState, action) => {
    switch (action.type) {
        case 'INICIAR_SESION':
            return {
                ...state,
                usuario: action.resultado.usuario,
                admin: action.resultado.admin,
                mensaje: action.resultado.mensaje,
                autenticacionLista: true
            };

        case 'INICIAR_SESION_ERROR':
            return {
                ...state,
                mensaje: action.error
            };

        case 'CERRAR_ALERTA':
            return {
                ...state,
                mensaje: null
            };
        case 'AUTENTICACION_LISTA':
            return {
                ...state,
                usuario: action.usuario,
                admin: action.admin,
                autenticacionLista: true
            };
        case 'CERRAR_SESION':
            return {
                ...state,
                usuario: null,
                autenticacionLista: true
            };
        case 'ACTUALIZAR_USUARIO':
            return {
                ...state,
                usuario: action.usuario,
                mensaje: action.mensaje ? action.mensaje : null,
                variante: action.variante ? action.variante : null
            };
        case 'ACTUALIZAR_USUARIO_ERROR':
            return {
                ...state,
                mensaje: action.mensaje ? action.mensaje : null,
                variante: action.variante ? action.variante : null
            };
        default:
            break;
    }
    return state;
}

export default autenticacionReducer;