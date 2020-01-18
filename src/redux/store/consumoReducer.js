const initState = {
    consumoMes: 0,
    costoU: 0,
    limite: 0,
    tipoLimite: null,
    historial: null,
    fechaConsumoInicial: null,
    fechaConsumoFinal: null,
    alerta: null,
    consultaAlerta: false,
    consumoRealCargado: false,
    limiteCargado: false,
    historialCargado: false,
    alertaCargada: false
}

const consumoReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CONSUMO_REAL':
            return {
                ...state,
                consumoMes: action.consumoMes,
                fechaConsumoInicial: action.fechaConsumoInicial,
                fechaConsumoFinal: action.fechaConsumoFinal,
                consumoRealCargado: true
            };
        case 'COSTO_U':
            return {
                ...state,
                costoU: action.costoU
            };
        case 'ALERTA':
            return {
                ...state,
                alerta: action.Alerta,
                consultaAlerta: action.consultaAlerta,
                alertaCargada: true
            };
        case 'LIMITE':
            return {
                ...state,
                limite: action.limite,
                tipoLimite: action.tipoLimite,
                limiteCargado: true
            };
        case 'HISTORIAL':
            return {
                ...state,
                historial: action.historial,
                historialCargado: true
            };
        case 'HISTORIAL_ERROR':
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
                historial: null,
                fechaConsumoInicial: null,
                fechaConsumoFinal: null,
                alerta: null,
                consultaAlerta: false,
                consumoRealCargado: false,
                limiteCargado: false,
                historialCargado: false,
                alertaCargada: false
            };

        default:
            break;
    }
    return state;
}

export default consumoReducer;