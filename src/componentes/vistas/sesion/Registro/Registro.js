import React from 'react';
import { NavLink } from 'react-router-dom';
import Aux from "../../../_Aux/_Aux";


class Registro extends React.Component {
    render () {
        return(
            <Aux>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r"/>
                            <span className="r s"/>
                            <span className="r s"/>
                            <span className="r"/>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-user-plus auth-icon"/>
                                </div>
                                <h3 className="mb-4">Registro</h3>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Nombre completo"/>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="Apellidos"/>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" placeholder="Correo electronico"/>
                                </div>
                                <div className="input-group mb-4">
                                    <input type="password" className="form-control" placeholder="Contraseña"/>
                                </div>
                                <button className="btn btn-primary shadow-2 mb-4">Enviar formulario</button>
                                <p className="mb-0 text-muted">¿Ya cuenta con una cuenta? <NavLink to="#">Iniciar sesion</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default Registro;