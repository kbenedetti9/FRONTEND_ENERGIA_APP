import React, { Component } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import '../cliente/Configuracion.css';
import { connect } from 'react-redux';
import Cargando from '../../cargando/cargando';

class Ajustes extends Component {

    state = {
        usuario: [],
        nombre: "",
        apellidos: "",
        identificacion: 0,
        telefono: 0,
        correo: "",
        contraseñaActual: "",
        contraseñaNueva1: "",
        contraseñaNueva2: ""

    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    _actualizar = (evento) => {

        evento.preventDefault();

        const { telefono, correo } = this.state;

        if (!telefono || !correo) {
            console.log("Campos vacios");
        } else {


        }




    }



    componentDidMount = () => {
        let { usuario } = this.props;
        if (!usuario.telefono) {
            usuario = {
                ...usuario,
                telefono: 0
            }
        }
        this.setState({
            usuario,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            identificacion: usuario.cedula,
            telefono: usuario.telefono ? usuario.telefono : 0,
            correo: usuario.correo
        });
    }

    render() {
        const { usuario, nombre, apellidos, identificacion, telefono, correo, contraseñaActual, contraseñaNueva1, contraseñaNueva2 } = this.state;
        console.log(usuario);
        if (!correo) {
            return <Cargando />;

        }
        return (
            <Row>
                <Col lg={7}>
                    <Card style={{ minHeight: '600px' }}>
                        <Card.Header id="configuracion">
                            Configuración
                            <i id="configIcon" className="fas fa-cogs"></i>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group">
                                <label id="label-input" className="etiqueta" htmlFor="inputNombre"> Nombre </label>
                                <input type="text" className="form-control" value={nombre + " " + apellidos} name={nombre} id="inputNombre" placeholder="" readOnly onChange={this._teclearFormulario} />
                            </div>
                            <div className="form-group">
                                <label id="label-input" className="etiqueta" htmlFor="inputCC"> Identificación </label>
                                <input type="text" className="form-control" value={identificacion} name={identificacion} id="inputCC" readOnly onChange={this._teclearFormulario} />
                            </div>
                            <div className="form-group">
                                <label id="label-input" className="etiqueta" htmlFor="inputTelefono"> Telefono</label>
                                <input type="number" name="telefono" className="form-control" value={telefono} id="inputTelefono" onChange={this._teclearFormulario} placeholder="Telefono" />
                            </div>
                            <div className="form-group">
                                <label id="label-input" className="etiqueta" htmlFor="inputCorreo"> Correo</label>
                                <input type="email" name="correo" className="form-control" value={correo} id="inputCorreo" onChange={this._teclearFormulario} placeholder="correo@correo.com" />
                            </div>
                            <Button className="mt-1 editar shadow-2" variant="primary" size="sm" onClick={this._actualizar}>
                                Editar
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card id="contrasena" style={{ minHeight: '600px' }}>
                        <Card.Body>
                            <i id="lockIcon" className="fas fa-key"></i>
                            <div className="form-group">
                                <label id="label-input" className="texto" htmlFor="inputContrasena"> Contraseña actual</label>
                                <input type="password" className="form-control" value={contraseñaActual} id="inputContrasena" onChange={this._teclearFormulario} name="contraseñaActual" placeholder="" />
                                <hr />
                            </div>

                            <h5 id="nueva" className="texto mt-2" >Determinar nueva contraseña</h5>
                            <div className="form-group">
                                <label id="label-input" className="texto mt-2" htmlFor="inputContrasenaN"> Nueva contraseña </label>
                                <input type="password" className="form-control" value={contraseñaNueva1} id="inputContrasenaN" onChange={this._teclearFormulario} name="contraseñaNueva1" placeholder="" />
                            </div>
                            <div className="form-group">
                                <label id="label-input" className="texto" htmlFor="inputContrasenaN2"> Repetir nueva contraseña </label>
                                <input type="password" className="form-control" value={contraseñaNueva2} id="inputContrasenaN2" onChange={this._teclearFormulario} name="contraseñaNueva2" placeholder="" />
                            </div>
                            <Button className="mt-1 editar shadow-2" variant="primary" size="sm">
                                Editar
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        usuario: state.autenticacion.usuario
    }
}

export default connect(mapStateToProps)(Ajustes);
