import React from 'react';
import Aux from "../../_Aux/_Aux";

import { connect } from 'react-redux';
import {cerrarSesion} from '../../../redux/acciones/autenticacionAcciones';
import {actualizarContraseña} from '../../../redux/acciones/clienteAcciones'

function CambiarContraseña({usuario, cerrarSesion}) {
    return (
        <Aux>
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-shield auth-icon" />
                            </div>
                            <h6 className="mb-4">Por tu seguridad y privacidad es necesario que cambies tu contraseña</h6>
                            <div className="input-group mb-4">
                                <input type="password" className="form-control" />
                            </div>
                            <div className="input-group mb-4">
                                <input type="password" className="form-control" />
                            </div>
                            <button className="btn btn-primary shadow-2 mb-4" onClick={() => actualizarContraseña(usuario.correo)}>Confirmar</button>
                            <button className="btn btn-danger shadow-2 mb-4" onClick={() => cerrarSesion(usuario.correo, false)} >Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    )
}

const mapStateToProps = (state) => {
    return {
      usuario: state.autenticacion.usuario
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      cerrarSesion: (correo, admin) => { dispatch(cerrarSesion(correo, admin)) },
      actualizarContraseña: (correo) => {dispatch(actualizarContraseña(correo))}
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(CambiarContraseña);
