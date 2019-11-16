import React from 'react';

import '../IniciarSesion/IniciarSesion.css'

import Aux from "../../../_Aux/_Aux";
import { Alert } from 'react-bootstrap';

//Redux
import { connect } from 'react-redux';

import { iniciarSesion, cerrarAlerta } from '../../../../redux/acciones/autenticacionAcciones';

import '../../../../../node_modules/font-awesome/css/font-awesome.min.css';
import Cargando from '../../../cargando/cargando';

class IniciarSesion extends React.Component {

    state = {
        correo: '',
        contraseña: '',
        sTypeContraseña: "password",
        sIconContraseña: "feather icon-eye-off"
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

    _cambiarTypeContraseña =()=>{
        const {sTypeContraseña}=this.state;
        if(sTypeContraseña ==="password"){
            this.setState({sTypeContraseña:"text", sIconContraseña: "feather icon-eye"});
        }else if(sTypeContraseña === "text"){
            this.setState({sTypeContraseña:"password", sIconContraseña:"feather icon-eye-off"});
        }
    }

    render() {

        const { correo, contraseña,sTypeContraseña,sIconContraseña } = this.state;
        const { mensaje, cargando } = this.props;

        return (
            <Aux>
                {cargando === true ? <Cargando /> : null }
                
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
                                <h3 className="mb-4 textoSesion">EnergiaApp</h3>
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
                                        <input type={sTypeContraseña} className="form-control" name='contraseña' value={contraseña} placeholder="Contraseña" onChange={this._teclearFormulario} required />
                                        <div className="input-group-append"> 
                                    <span className="input-group-text" id="basic-addon2" onClick={this._cambiarTypeContraseña}><i className={sIconContraseña}></i></span>
                                        </div>
                                    </div>
                                    <button id="ingresar" className="btn btn-primary shadow-2 mb-4" type="submit" disabled={cargando}>Ingresar</button>

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
        mensaje: state.autenticacion.mensaje,
        cargando: state.autenticacion.cargando
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        iniciarSesion: (credeciales) => { dispatch(iniciarSesion(credeciales)) },
        cerrarAlerta: () => { dispatch(cerrarAlerta()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IniciarSesion);