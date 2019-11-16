import React, { Component } from 'react';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import '../cliente/Configuracion.css';
import { connect } from 'react-redux';
import Cargando from '../../cargando/cargando';
import Confirmacion from '../../VentanaModal/Confirmacion';
import { cerrarSesion, cerrarAlerta } from '../../../redux/acciones/autenticacionAcciones';
import { actualizarDatos } from '../../../redux/acciones/clienteAcciones';


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
        contraseñaNueva2: "",
        habilitarModal: false,
        cambiarContrasena: false,
        mensaje: null,
        mensajeModal: "Esta accion realizará una modificacion en su perfi, ¿Esta seguro de continuar?",
        datosCargados: false

    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    _teclearTelefono = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        if (name === "telefono") {
            if (value.length < 11) {
                this.setState({
                    [name]: value
                });
            }
        }
    }

    _validarCorreo(correo) {
        var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(correo);
    }

    _lanzarmensaje = (mensaje) => {
        this.setState({ mensaje });
    }

    _actualizar = (evento) => {

        let cambiarContrasena = false;
        let habilitarModal = true;
        let mensaje = null;
        evento.preventDefault();

        const { telefono, correo, contraseñaActual, contraseñaNueva1, contraseñaNueva2, usuario } = this.state;
        if ((telefono === null || telefono < 0 || telefono === "") || !correo || !this._validarCorreo(correo)) {
            habilitarModal = false;
            mensaje = "Campos vacios y/o correo invalido";
            this._lanzarmensaje(mensaje);
        } else {
            if (contraseñaActual || contraseñaNueva1 || contraseñaNueva2) {
                if (!contraseñaActual || !contraseñaNueva1 || !contraseñaNueva2) {
                    mensaje = "Todos los campos son requeridos";
                    habilitarModal = false;
                    this._lanzarmensaje(mensaje);
                } else {
                    if (contraseñaNueva1 !== contraseñaNueva2) {
                        mensaje = "Las contraseñas no coinciden";
                        habilitarModal = false;
                        this._lanzarmensaje(mensaje);
                    } else {

                        cambiarContrasena = true;

                    }
                }

            }
            if (usuario.correo !== correo) {
                this.setState({ mensajeModal: "Al actualizar su correo la sesion sera finalizada" });
            }
            this.setState({
                habilitarModal,
                cambiarContrasena
            });


        }

    }

    _cerrarVentana = () => {
        this.setState({
            habilitarModal: false
        })
    }

    _confirmarCambios = () => {
        const { telefono, correo, contraseñaActual, contraseñaNueva1, cambiarContrasena, usuario } = this.state;
        this.props.actualizarDatos(correo, false, cambiarContrasena, contraseñaActual, contraseñaNueva1, telefono, usuario);
        if (usuario.correo !== correo) {
            this.props.cerrarSesion(usuario.correo, false);
        }
        this.setState({
            habilitarModal: false,
            contraseñaActual: "",
            contraseñaNueva1: "",
            contraseñaNueva2: "",
        });
    }

    _cerrarAlerta = () => {
        this.setState({ mensaje: null });
        this.props.cerrarAlerta();
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
            correo: usuario.correo,
            datosCargados: true
        });
    }

    render() {
        const { nombre, apellidos, identificacion, telefono, correo, contraseñaActual, contraseñaNueva1, contraseñaNueva2, habilitarModal, mensaje, mensajeModal, datosCargados } = this.state;
        const { mensajeStore, varianteStore } = this.props;

        if (!datosCargados) {
            return <Cargando />;
        }

        return (
            <Card >
                {mensaje
                    ?
                    <Alert variant="danger" style={{ backgroundColor: 'rgba(233, 29, 57,1)' }} onClose={this._cerrarAlerta} dismissible>
                        <h6 style={{ color: 'white', fontSize: '11px' }}>{mensaje}</h6>
                    </Alert>
                    :
                    mensajeStore
                        ?
                        <Alert variant={varianteStore} onClose={this._cerrarAlerta} dismissible>
                            <h6 style={{ color: 'black', fontSize: '11px' }}>{mensajeStore}</h6>
                        </Alert>
                        :
                        null}
                <Row>
                    <Col lg={7} md={7} sm={12} xl={7} id="datosCard">

                        <Card style={{ minHeight: '500px' }} id="datos">
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
                                    <input type="number" name="telefono" className="form-control" value={telefono} id="inputTelefono" onChange={this._teclearTelefono} placeholder="Telefono" />
                                </div>
                                <div className="form-group">
                                    <label id="label-input" className="etiqueta" htmlFor="inputCorreo"> Correo</label>
                                    <input type="email" name="correo" className="form-control" value={correo} id="inputCorreo" onChange={this._teclearFormulario} placeholder="correo@correo.com" />
                                </div>
                                <Button id="actualizar" className="mt-1 shadow-2 texto" variant="primary" size="sm" onClick={this._actualizar}>
                                    Actualizar
                                    </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={5} md={5} sm={12} xl={5} id="contrasenaCard" >
                        <Card id="contrasena" style={{ minHeight: '560px' }}>
                            <Card.Body id="contenidoContrasena">
                                <div className="row justify-content-end">
                                    <i id="lockIcon" className="fas fa-key"></i>
                                </div>
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


                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Confirmacion titulo="Confirmar cambios" mensaje={mensajeModal} estado={habilitarModal} ocultarVentana={this._cerrarVentana} metodoAceptar={this._confirmarCambios} />
            </Card>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        usuario: state.autenticacion.usuario,
        mensajeStore: state.autenticacion.mensaje,
        varianteStore: state.autenticacion.variante
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cerrarSesion: (correo, admin) => dispatch(cerrarSesion(correo, admin)),
        actualizarDatos: (correo, sesionP, cambiarContrasena, contrasena, contrasenaNueva, telefono, usuario) => dispatch(actualizarDatos(correo, sesionP, cambiarContrasena, contrasena, contrasenaNueva, telefono, usuario)),
        cerrarAlerta: () => { dispatch(cerrarAlerta()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Ajustes);
