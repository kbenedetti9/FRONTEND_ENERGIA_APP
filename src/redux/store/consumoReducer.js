const initState = {
    consumoMes: 0,
    costoU: 0,
    limite: 0,
    tipoLimite: null
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
        default:
            break;
    }
    return state;
}

export default consumoReducer;