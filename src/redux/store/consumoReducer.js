const initState = {
    consumoMes: 0
}

const consumoReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CONSUMO_REAL':
            return {
                ...state,
                consumoMes: action.consumoMes
            };
        default:
            break;
    }
    return state;
}

export default consumoReducer;