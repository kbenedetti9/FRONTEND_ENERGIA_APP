const initState = {
    listaClientes: [],
    consultaLista: false,
    mensaje: null,
    variante: null,
    costoUnitario: 0
}

const sistemaReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CLIENTES':
            return {
                ...state,
                listaClientes: action.clientes,
                consultaLista: true
            };
        case 'RECUPERAR_CONTRASENA':
            return {
                ...state,
                mensaje: action.mensaje,
                variante: action.variante
            };
        case 'ADMINISTRADOR_ACCION_ERROR':
            return {
                ...state,
                mensaje: action.mensaje ? action.mensaje : null,
                variante: action.variante ? action.variante : null
            };
        case 'ADMINISTRADOR_ACCION':
            return {
                ...state,
                mensaje: action.mensaje ? action.mensaje : null,
                variante: action.variante ? action.variante : null
            };
        case 'COSTO_UNITARIO':
            return {
                ...state,
                costoUnitario: action.costoUnitario
            };
        case 'CERRAR_SESION_USUARIO':
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

export default sistemaReducer;