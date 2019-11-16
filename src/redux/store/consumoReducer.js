const initState = {
    consumoMes: 0,
    costoU: 0,
    limite: 0,
    tipoLimite: null,
    historial: null
}

const consumoReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CONSUMO_REAL':
            return {
                ...state,
                consumoMes: action.consumoMes
            };
        case 'COSTO_U':
            return {
                ...state,
                costoU: action.costoU
            };
        case 'LIMITE':
            return {
                ...state,
                limite: action.limite,
                tipoLimite: action.tipoLimite
            };
        case 'ULTIMO_HISTORIAL':
            return {
                ...state,
                historial: action.historial
            };
        case 'ULTIMO_HISTORIAL_ERROR':
            return {
                ...state,
                historial: "ERROR"
            };
        case 'REINICIAR_ESTADOS':
            return {
                consumoMes: 0,
                costoU: 0,
                limite: 0,
                tipoLimite: null,
                historial: null
            };

        default:
            break;
    }
    return state;
}

export default consumoReducer;