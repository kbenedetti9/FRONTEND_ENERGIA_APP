//import todos los reducer
import menuReducer from './menuReducer';
import autenticacionReducer from './autenticacionReducer';
import consumoReducer from './consumoReducer';
import sistemaReducer from './sistemaReducer';

//Para combinar los reducer
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
    //los reducer key: value
    menu: menuReducer,
    autenticacion: autenticacionReducer,
    consumo: consumoReducer,
    sistema: sistemaReducer
});

export default rootReducers;