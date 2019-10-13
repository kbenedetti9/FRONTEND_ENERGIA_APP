//Componente
import React, { Component, Suspense } from 'react';
import Loadable from 'react-loadable';

//Redux
import { connect } from 'react-redux';
import { autenticacionLista, cerrarSesion } from '../redux/acciones/autenticacionAcciones';

import Aux from './_Aux/_Aux';
import Cargando from './cargando/cargando';
import Api from '../api/Api';

//Al ser este archivo quien contiene las rutas, se debe import lo necesario.
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

//scss
import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './app.scss';

//Componente Menu que aparece a la izquierda
import Menu from './menu/menu';
//Componente navbar
import Navbar from './navbar/navbar';

//importamos la ruta por defecto (La importará cuando sea requerida)
const InicarSesion = Loadable({ loader: () => import('./vistas/sesion/IniciarSesion/IniciarSesion'), loading: Cargando });
const Registrarme = Loadable({ loader: () => import('./vistas/sesion/Registro/Registro'), loading: Cargando });

//Prueba - Borrar
const Home = Loadable({ loader: () => import('./administrador-vistas/home'), loading: Cargando });


export class App extends Component {

  cambiarTitulo = (titulo) => {
    console.log(titulo)
  }

  ocultarMenu = () => {
    if (this.props.menu_añadido === "mob-open") {
      this.props.ocultarMenu("");
    }
  }

  componentDidMount = async () => {
    const respuesta = await Api.estoyAutenticado();
    if(respuesta.estado){
      this.props.autenticacionLista(respuesta.usuario);
    }else{
      this.props.autenticacionLista(null);
    }
  }

  render() {
    const { usuario, autenticacion } = this.props;

    if(!autenticacion){
      return <Cargando />
    }
    
    return (

      < Aux >
        <Suspense fallback={<Cargando />}>
          {/* Suspense se utiliza para mostrar "algo" miestras se carga el/los import necesarios */}
          {usuario ?
            <Aux>
              <Menu />
              <Navbar cerrarSesion={this.props.cerrarSesion} />
              <div className="pcoded-main-container" onClick={this.ocultarMenu}>
                <div className="pcoded-wrapper">
                  <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                      <div className="main-body">
                        <Switch>
                          <Route path="/home" component={Home} />
                          <Route path="/" render={()=> <Redirect to='/home' />} />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Aux>
            :
            <Switch>
              <Route exact path="/iniciarSesion" component={InicarSesion} />
              <Route exact path="/registrarme" component={Registrarme} />
              <Route path="/" render={()=> <Redirect to='/iniciarSesion' />} />
            </Switch>
          }

        </Suspense>
      </Aux >
    )
  }
}


const mapStateToProps = (state) => {
  return {
    menu_añadido: state.menu.className_menu_añadido,
    usuario: state.autenticacion.usuario,
    autenticacion: state.autenticacion.autenticacionLista
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ocultarMenu: (accion) => {dispatch({ type: "ACCIONAR_MENU_APP", accion })},
    autenticacionLista: (usuario) => {dispatch(autenticacionLista(usuario))},
    cerrarSesion: () => {dispatch(cerrarSesion())}
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)((App)));
