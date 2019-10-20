//Componente
import React, { Component, Suspense } from 'react';
import Loadable from 'react-loadable';

//Redux
import { connect } from 'react-redux';
import { autenticacionLista, cerrarSesion } from '../redux/acciones/autenticacionAcciones';
import { consultarConsumoReal, consultarLimite } from '../redux/acciones/clienteAcciones';
import {obtenerListaClientes} from '../redux/acciones/administradorAcciones';

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
//Rutas para sesion
const InicarSesion = Loadable({ loader: () => import('./vistas/sesion/IniciarSesion/IniciarSesion'), loading: Cargando });
//Rutas para administrador
const Home = Loadable({ loader: () => import('./vistas/administrador/home'), loading: Cargando });
//Rutas para cliente
const ConsumoReal = Loadable({ loader: () => import('./vistas/cliente/consumoReal'), loading: Cargando });
const CambiarContraseña = Loadable({ loader: () => import('./vistas/cliente/CambiarContraseña'), loading: Cargando });
const Historial = Loadable({ loader: () => import('./vistas/cliente/Historial'), loading: Cargando });
const Ajustes = Loadable({ loader: () => import('./vistas/cliente/Ajustes'), loading: Cargando });

export class App extends Component {

  ocultarMenu = () => {
    if (this.props.menu_añadido === "mob-open") {
      this.props.ocultarMenu("");
    }
  }

  componentDidMount = async () => {
    const respuesta = await Api.estoyAutenticado();
    if (respuesta.estado) {
      if (!respuesta.admin) {
        this.props.consultarConsumoReal(respuesta.usuario.correo);
        this.props.consultarLimite(respuesta.usuario.correo);
      }else{
        this.props.obtenerListaClientes();
      }
      this.props.autenticacionLista(respuesta.usuario, respuesta.admin);
    } else {
      this.props.autenticacionLista(null, false);
    }
  }

  render() {

    const { usuario, autenticacion, admin } = this.props;

    if (!autenticacion) {
      return <Cargando />
    }

    console.log(usuario)

    return (

      < Aux >
        <Suspense fallback={<Cargando />}>
          {/* Suspense se utiliza para mostrar "algo" miestras se carga el/los import necesarios */}
          {usuario ?
            !admin && !usuario.activo ?
              <Switch>
                <Route exact path="/App/seguridad" component={CambiarContraseña} correo={usuario.correo} cerrarSesion={this.props.cerrarSesion} />
                <Route path="/" render={() => <Redirect to='/App/seguridad' />} />
              </Switch>
              :
              <Aux>
                <Menu admin={admin} usuario={usuario} />
                <Navbar cerrarSesion={this.props.cerrarSesion} admin={admin} correo={usuario.correo} nombre={usuario.nombre} ocultarMenu={this.ocultarMenu} />
                <div className="pcoded-main-container" onClick={this.ocultarMenu}>
                  <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                      <div className="pcoded-inner-content">
                        <div className="main-body">
                          {admin ?
                            <Switch>
                              <Route exact path="/administrar" component={Home} />
                              <Route path="/" render={() => <Redirect to='/administrar' />} />
                            </Switch>
                            :
                            <Switch>
                              <Route exact path="/App/consumoReal" component={ConsumoReal} />
                              <Route exact path="/App/historial" render={() => <Historial usuario={usuario} />} />
                              <Route exact path="/App/ajustes" component={Ajustes} />{/*KAREN*/}
                              <Route path="/" render={() => <Redirect to='/App/consumoReal' />} />
                            </Switch>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Aux>
            :
            <Switch>
              <Route exact path="/iniciarSesion" component={InicarSesion} />
              <Route path="/" render={() => <Redirect to='/iniciarSesion' />} />
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
    autenticacion: state.autenticacion.autenticacionLista,
    admin: state.autenticacion.admin
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ocultarMenu: (accion) => { dispatch({ type: "ACCIONAR_MENU_APP", accion }) },
    autenticacionLista: (usuario, admin) => { dispatch(autenticacionLista(usuario, admin)) },
    cerrarSesion: (correo, admin) => { dispatch(cerrarSesion(correo, admin)) },
    consultarConsumoReal: (correo) => { dispatch(consultarConsumoReal(correo)) },
    consultarLimite: (correo) => {dispatch(consultarLimite(correo))},
    obtenerListaClientes: () => dispatch(obtenerListaClientes())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)((App)));
