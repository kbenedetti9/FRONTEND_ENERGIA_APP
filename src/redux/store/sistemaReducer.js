const initState = {
    listaClientes: [],
    consultaLista: false,
    mensaje: null,
    variante: null
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
            // case 'ACTUALIZAR_USUARIO':
            //     return {
            //         ...state,
            //         usuario: action.usuario,
            //         mensaje: action.mensaje ? action.mensaje : null,
            //         variante: action.variante ? action.variante : null
            //     };
        default:
            break;
    }
    return state;
}

export default sistemaReducer;