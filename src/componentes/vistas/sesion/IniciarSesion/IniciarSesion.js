import React from 'react';

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

                                <h3 className="mb-4">Ingresar a EnergiaApp</h3>

                                <form onSubmit={this._iniciarSesion}>
                                    <div className="input-group mb-3">
                                        <input type="email" className="form-control" name='correo' value={correo} placeholder="Correo" onChange={this._teclearFormulario} required />
                                    </div>

                                    <div className="input-group mb-4">
                                        <input type="password" className="form-control" name='contraseña' value={contraseña} placeholder="Contraseña" onChange={this._teclearFormulario} required/>
                                    </div>

                                    <button className="btn btn-primary shadow-2 mb-4" type= "submit">Ingresar</button>

                                </form>
                                {mensaje
                                    ?
                                    <Alert variant="danger" onClose={() => this.props.cerrarAlerta()} dismissible>
                                        <Alert.Heading>
                                            <h5>Error:</h5>
                                        </Alert.Heading>
                                        <h5>{mensaje}
                                        </h5>
                                    </Alert>
                                    :
                                    null}
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