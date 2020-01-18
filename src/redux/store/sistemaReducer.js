const initState = {
    listaClientes: [],
    consultaLista: false,
    mensaje: null,
    variante: null,
    costoUnitario: 0,
    creadoCliente: false,
    limpiarCampos: false,
    fechaIniCorte: null,
    fechaFinCorte: null,
    sistemaCargado: false
}

const sistemaReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CLIENTES':
            return {
                ...state,
                listaClientes: action.clientes,
                consultaLista: true
            };
        case 'CREANDO_CLIENTE':
            return {
                ...state,
                creadoCliente: true
            };
        case 'CREANDO_CLIENTE_FIN':
            return {
                ...state,
                creadoCliente: false,
                limpiarCampos: true
            };
        case 'CAMPOS_LIMPIOS':
            return {
                ...state,
                limpiarCampos: false
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
                costoUnitario: action.costoUnitario,
                fechaIniCorte: action.fechaIniCorte,
                fechaFinCorte: action.fechaFinCorte,
                sistemaCargado: true
            };
        case 'CERRAR_SESION_USUARIO':
            return {
                ...state,
                mensaje: action.mensaje ? action.mensaje : null,
                variante: action.variante ? action.variante : null
            };
        case 'OCULTAR_MENSAJE':
            return {
                ...state,
                mensaje: null,
                variante: null
            };
        case 'COSTO_U':
            return {
                ...state,
                costoUnitario: action.costoU
            };
        case 'REINICIAR_ESTADOS':
            return {
                listaClientes: [],
                consultaLista: false,
                mensaje: null,
                variante: null,
                costoUnitario: 0,
                fechaIniCorte: null,
                fechaFinCorte: null,
                sistemaCargado: false
            };
        default:
            break;
    }
    return state;
}

export default sistemaReducer;