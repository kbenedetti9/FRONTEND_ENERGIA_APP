const initState = {
    usuario: null,
    autenticacionLista: false
}

const autenticacionReducer = (state = initState, action) => {
    switch (action.type) {
        case 'INICIAR_SESION':
            return {
                ...state,
                usuario: action.resultado,
                autenticacionLista: true
            }

        case 'INICIAR_SESION_ERROR':
            console.log(action.error);
            return state;

        case 'AUTENTICACION_LISTA':
            console.log(action)
            return {
                ...state,
                usuario: action.usuario,
                autenticacionLista: true
            }
        case 'CERRAR_SESION':
            return {
                ...state,
                usuario: null,
                autenticacionLista: true
            }
        default:
            break;
    }
    return state;
}

export default autenticacionReducer;