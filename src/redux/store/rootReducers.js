//import todos los reducer
import itemMenuReducer from './itemMenuReducer';
import menuReducer from './menuReducer';
import appReducer from './appReducer';
import autenticacionReducer from './autenticacionReducer';
import consumoReducer from './consumoReducer';

//Para combinar los reducer
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
    //los reducer key: value
    items: itemMenuReducer,
    menu: menuReducer,
    app: appReducer,
    autenticacion: autenticacionReducer,
    consumo: consumoReducer
});

export default rootReducers;