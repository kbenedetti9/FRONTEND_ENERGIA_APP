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
        default:
            break;
    }
    return state;
}

export default sistemaReducer;