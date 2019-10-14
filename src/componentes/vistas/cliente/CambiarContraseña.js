import React, { Component } from 'react';
import Aux from "../../_Aux/_Aux";
import { Alert } from 'react-bootstrap';

import { connect } from 'react-redux';
import { cerrarSesion } from '../../../redux/acciones/autenticacionAcciones';
import { actualizarContraseña } from '../../../redux/acciones/clienteAcciones'

class CambiarContraseña extends Component {

    state = {
        contraseña_1: '',
        contraseña_2: '',
        mensaje: null
    }

    _cambiarContraseña = (evento) => {
        evento.preventDefault();

        const { contraseña_1, contraseña_2 } = this.state;
        const { usuario } = this.props;

        if (contraseña_1 === contraseña_2 && contraseña_1 !== usuario.correo) {
            const usuarioActualizado = {
                ...usuario,
                activo: true
            }
            this.props.actualizarContraseña(usuario.correo, contraseña_1, usuarioActualizado);
        } else {
            this.setState({mensaje: 'Las contrasenas deben coincidir y ser diferentes al correo'});
        }
    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    render() {

        const { contraseña_1, contraseña_2, mensaje } = this.state;
        const { usuario } = this.props;

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
                                {mensaje ?
                                    <Alert variant="danger" style={{backgroundColor:'red'}} onClose={() => this.setState({mensaje:null})} dismissible>
                                        <h6 style={{color:'white', fontSize:'11px'}}>{mensaje}</h6>
                                    </Alert>
                                    : null}
                                <form onSubmit={this._cambiarContraseña}>
                                    <div className="input-group mb-4">
                                        <input type="password" name="contraseña_1" value={contraseña_1} placeholder="Ingrese la contraseña" className="form-control" onChange={this._teclearFormulario} required />
                                    </div>
                                    <div className="input-group mb-4">
                                        <input type="password" name="contraseña_2" value={contraseña_2} placeholder="Repita la contraseña nuevamente" className="form-control" onChange={this._teclearFormulario} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary shadow-2 mb-4">Confirmar</button>
                                    <button type="button" className="btn btn-danger shadow-2 mb-4" onClick={() => this.props.cerrarSesion(usuario.correo, false)} >Cancelar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        )
    }


}

const mapStateToProps = (state) => {
    return {
        usuario: state.autenticacion.usuario
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cerrarSesion: (correo, admin) => { dispatch(cerrarSesion(correo, admin)) },
        actualizarContraseña: (correo, contraseña, usuario) => { dispatch(actualizarContraseña(correo, contraseña, usuario)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CambiarContraseña);
