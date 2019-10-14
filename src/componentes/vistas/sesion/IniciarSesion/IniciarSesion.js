import React from 'react';

import '../IniciarSesion/IniciarSesion.css'

import Aux from "../../../_Aux/_Aux";
import { Alert } from 'react-bootstrap';

//Redux
import { connect } from 'react-redux';

import { iniciarSesion, cerrarAlerta } from '../../../../redux/acciones/autenticacionAcciones';


class IniciarSesion extends React.Component {

    state = {
        correo: '',
        contraseña: ''
    }

    _iniciarSesion = (evento) => {
        evento.preventDefault();
        this.props.iniciarSesion(this.state);
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

        const { correo, contraseña } = this.state;
        const { mensaje } = this.props;


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
                                    <i className="feather icon-unlock auth-icon" />
                                </div>

                                <h3 className="mb-4">EnergiaApp</h3>
                                {mensaje
                                    ?
                                    <Alert variant="danger" style={{ backgroundColor: 'red' }} onClose={() => this.props.cerrarAlerta()} dismissible>
                                        <h6 style={{ color: 'white', fontSize: '11px' }}>{mensaje}</h6>
                                    </Alert>
                                    :
                                    null}
                                <form onSubmit={this._iniciarSesion}>
                                    <div className="input-group mb-3 ">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" ><i className="feather icon-user"></i></span>
                                        </div>
                                        <input type="email" className="form-control" name='correo' value={correo} placeholder="Correo" onChange={this._teclearFormulario} required />
                                    </div>

                                    <div className="input-group mb-4">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" ><i className="feather icon-lock"></i></span>
                                        </div>
                                        <input type="password" className="form-control" name='contraseña' value={contraseña} placeholder="Contraseña" onChange={this._teclearFormulario} required />
                                    </div>
                                    <button className="btn btn-primary shadow-2 mb-4" type="submit">Ingresar</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mensaje: state.autenticacion.mensaje
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        iniciarSesion: (credeciales) => { dispatch(iniciarSesion(credeciales)) },
        cerrarAlerta: () => { dispatch(cerrarAlerta()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IniciarSesion);