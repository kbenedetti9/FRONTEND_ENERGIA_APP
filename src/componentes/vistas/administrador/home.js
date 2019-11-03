//Componente
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Cargando from '../../cargando/cargando';
import '../administrador/Administrador.css';
import { recuperarContrasena, actualizarUsuario, crearUsuario, eliminarUsuario, actualizarCostoUnitario, cerrarSesionUsuario, ocultarAlerta } from '../../../redux/acciones/administradorAcciones';
import { Card } from 'react-bootstrap';

let listaClientes = [];

export class Home extends Component {

    state = {
        costoUnitario: 0,
        nombre: "",
        apellidos: "",
        correo: "",
        cedula: "",
        id_medidor: "",
        btnEditarCliente: false,
        mensajeInterno: null,
        varianteInterna: "",
        listaClientesLocal: null
    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    _validaCorreo(correo) {
        var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(correo);
    }

    _filtrarCliente = (evento) => {

        const value = evento.target.value;
        console.log()
        var filtro = listaClientes.filter((str) => {
            if (str.correo && str.nombre && str.apellidos && str.id_medidor && str.cedula) {
                return str.nombre.toLowerCase().includes(value.toLowerCase()) ||
                    str.correo.toLowerCase().includes(value.toLowerCase()) ||
                    str.apellidos.toLowerCase().includes(value.toLowerCase()) ||
                    str.id_medidor === +value ||
                    str.cedula === +value;
            } else {
                return null;
            }
        });

        if (value) {
            this.setState({
                listaClientesLocal: filtro
            });
        } else {
            this.setState({
                listaClientesLocal: null
            });
        }

    }

    _editarCliente = (cliente) => {
        if (cliente) {
            this.setState({
                correo: cliente.correo,
                nombre: cliente.nombre,
                apellidos: cliente.apellidos,
                id_medidor: cliente.id_medidor,
                cedula: cliente.cedula,
                btnEditarCliente: true
            });
        }
    }

    _recuperarContraseña = (evento) => {

        const correo = evento.target.value;
        this.props.recuperarContrasena(correo, correo);//correo y nueva clave

    }

    _eliminarCliente = (evento, correo) => {
        evento.preventDefault();
        this.props.eliminarUsuario(correo);
    }

    _actualizarCliente = (evento) => { /*KAREEEEEEEEEEEEEEEEEEEEN*/
        evento.preventDefault();
        const { id_medidor, correo } = this.state;

        if (!id_medidor) {
            this.setState({ mensajeInterno: "No deben haber campos vacios", varianteInterna: "danger" });
        } else {
            this.props.actualizarUsuario(correo, id_medidor);
        }

    }

    _nuevoCliente = () => {

        const { correo, nombre, apellidos, id_medidor, cedula } = this.state;

        if (correo === "" || nombre === "" || id_medidor === "" || apellidos === "" || cedula === "" || !this._validaCorreo(correo)) {
            this.setState({ mensajeInterno: "No debe haber campos vacios y el correo debe ser valido", varianteInterna: "danger" });
        } else {
            this.props.crearUsuario(correo, nombre, apellidos, id_medidor, cedula);
        }
    }

    _actualizarCostoUnitario = (evento) => {
        evento.preventDefault();
        if (this.state.costoUnitario > 0) {
            this.props.actualizarCostoUnitario(this.state.costoUnitario);
        } else {
            this.setState({ mensajeInterno: "Debe diligenciar un costo unitario valido", varianteInterna: "danger" });
        }
    }

    _cerrarSesionUsuario = (evento, correo) => {
        evento.preventDefault();
        this.props.cerrarSesionUsuario(correo);
    }

    _limpiarInputs = () => {
        this.setState({
            costoUnitario: 0,
            nombre: "",
            apellidos: "",
            correo: "",
            cedula: "",
            id_medidor: "",
            btnEditarCliente: false,
            mensajeInterno: null,
            varianteInterna: "",
        });
    }

    _cerrarAlerta = () => {
        this.setState({
            mensajeInterno: null,
            varianteInterna: ""
        });
        this.props.ocultarAlerta();
    }

    render() {

        const { nombre, apellidos, correo, cedula, id_medidor, btnEditarCliente, mensajeInterno, varianteInterna, listaClientesLocal } = this.state;
        const { clientes, consultaLista, mensajeStore, varianteStore, costoUnitario } = this.props;

        if (!consultaLista) {
            return <Cargando />
        }

        let listaTabla = [];//Lista final que usa la tabla

        listaClientes = clientes;//Usada solo para el filtro

        if (listaClientesLocal) {//Lista que esta llena si solo si se esta filtrando
            listaTabla = listaClientesLocal;
        } else {
            listaTabla = clientes;
        }

        return (

            <div className="container">
                <Col lg={12}>
                    <Card className="mb-4">
                        <Card.Body className="cuerpo" >
                            <Row className="fila">
                                <Col lg={12}>
                                <h5 className="textoAdmin">Determina costo unitario</h5>
                                </Col>
                            </Row>
                            <Row className="fila">
                            <Col lg={3}>
                            <div className="">
                                <input name="costoUnitario" className="form-control form-control-sm inputUser textoAdmin" placeholder="Costo unitario" type="Number" onChange={this._teclearFormulario} />
                            </div>
                            </Col>
                            <Col lg={5}>
                            <Button type="button" className="mr-3 mb-4 textoAdmin botonCu" size="sm" onClick={this._actualizarCostoUnitario}> Actualizar </Button>
                            </Col>
                            <Col lg={4}>

                                <p className="textoAdmin">Costo unitario actual: ${costoUnitario}</p>
                            
                            
                            </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Row className='container fila'>
                    <Col lg={12} >
                        <Card>
                            <Card.Body className="cuerpo" >
                                <Row className='container fila'>
                                    <Col lg={3}>

                                        <div className="card mx-auto cardComponent">
                                            {mensajeStore
                                                ?
                                                <Alert variant={varianteStore} onClose={this._cerrarAlerta} dismissible>
                                                    <h6 style={{ color: 'black', fontSize: '11px' }}>{mensajeStore}</h6>
                                                </Alert>
                                                :
                                                mensajeInterno
                                                    ?
                                                    <Alert variant={varianteInterna} onClose={this._cerrarAlerta} dismissible>
                                                        <h6 style={{ color: 'black', fontSize: '11px' }}>{mensajeInterno}</h6>
                                                    </Alert>
                                                    :
                                                    null}
                                            <div className="tituloNuevoCliente">
                                                <h6 id="tituloAdmin" className="mt-3 ml-4">Formulario de cliente</h6>
                                            </div>
                                            <div className="card-header" style={{ textAlign: 'left', fontSize: '12px' }}>
                                                <div className="form-group">
                                                    <label forhtml="nombre">Nombre(s) del cliente</label>
                                                    <input className="form-control form-control-sm inputUser" id="nombre" type="text" name="nombre" placeholder="Nombre(s) del cliente" value={nombre} onChange={this._teclearFormulario} disabled={btnEditarCliente} required></input>
                                                </div>

                                                <div className="form-group">
                                                    <label forhtml="apellidos">Apellido(s) del cliente</label>
                                                    <input id="apellidos" className="form-control form-control-sm inputUser" type="text" name="apellidos" placeholder="Apellido(s) del cliente" value={apellidos} onChange={this._teclearFormulario} disabled={btnEditarCliente} required></input>
                                                </div>

                                                <div className="form-group">
                                                    <label forhtml="correo">Correo del cliente</label>
                                                    <input id="correo" className="form-control form-control-sm inputUser" type="text" name="correo" placeholder="cliente@servicio.dominio" value={correo} onChange={this._teclearFormulario} disabled={btnEditarCliente} required />
                                                </div>

                                                <div className="form-group">
                                                    <label forhtml="cedula">Cedula del cliente</label>
                                                    <input id="cedula" className="form-control form-control-sm inputUser" type="Number" name="cedula" value={+cedula} onChange={this._teclearFormulario} disabled={btnEditarCliente} required />
                                                </div>

                                                <div className="form-group">
                                                    <label forhtml="id_medidor">ID del medidor a usar</label>
                                                    <input name="id_medidor" className="form-control form-control-sm inputUser" type="Number" value={+id_medidor} onChange={this._teclearFormulario} required />
                                                </div>

                                                <div className="btn-group-md">
                                                    {btnEditarCliente ?
                                                        <button type="submit" className="btn btn-primary btn-sm mr-3 btn-newUser inputUser" onClick={this._actualizarCliente}>
                                                            Actualizar
                                        </button>
                                                        :
                                                        <button type="submit" className="btn btn-primary btn-sm mr-3 btn-newUser inputUser" onClick={this._nuevoCliente}>
                                                            Crear
                                        </button>
                                                    }
                                                    <button type="submit" className="btn btn-danger btn-sm btn-newUser inputUser" onClick={this._limpiarInputs}>
                                                        Cancelar
                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                    </Col>
                                    <Col lg={9}>
                                        {/* Alerta de algun error */}

                                        <div className="filtroCliente">
                                            <input className="form-control" type="text" placeholder="Buscar cliente..." aria-label="Search" onChange={this._filtrarCliente} />
                                        </div>

                                        {listaTabla.length > 0 ?
                                            <div className="table-responsive">
                                                <table className="table table-striped " style={{ fontSize: '13px', textAlign: 'center' }}>
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th scope="col">Nombre</th>
                                                            <th scope="col">Correo</th>
                                                            <th scope="col">CC</th>
                                                            <th scope="col">ID</th>
                                                            <th scope="col">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {clientes.map((cliente, index) =>
                                                            <tr key={index}>
                                                                <td>{cliente.nombre}</td>
                                                                <td>{cliente.correo}</td>
                                                                <td>{cliente.cedula}</td>
                                                                <td>{cliente.id_medidor}</td>
                                                                <td>
                                                                    <div className="btn-group btn-group-sm" role="group">

                                                                        <button className="btn btn-secondary btn-sm botonAdmin" style={{ padding: '0.5', fontSize: '12px' }} onClick={() => this._editarCliente(cliente)}>
                                                                            <i className="feather icon-edit"></i>
                                                                        </button>
                                                                        <button className="btn btn-secondary btn-sm botonAdmin" style={{ padding: '0.5', fontSize: '12px' }} value={cliente.correo} onClick={this._recuperarContraseña}>
                                                                            <i className="feather icon-refresh-ccw"></i>
                                                                        </button>
                                                                        <button className="btn btn-danger btn-sm botonAdmin mx-auto" style={{ padding: '0.5', fontSize: '12px' }} value={cliente.correo} onClick={(evento) => this._eliminarCliente(evento, cliente.correo)}><i className="feather icon-trash"></i></button>
                                                                        <button className="btn btn-danger btn-sm botonAdmin mx-auto" style={{padding: '0.5', fontSize: '12px'}} value={cliente.correo} onClick={(evento) => this._cerrarSesionUsuario(evento, cliente.correo)}><i className="feather icon-trash"></i></button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}

                                                    </tbody>
                                                </table>
                                            </div>
                                            :
                                            <div>No hay clientes.</div>
                                        }


                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        clientes: state.sistema.listaClientes,
        consultaLista: state.sistema.consultaLista,
        mensajeStore: state.sistema.mensaje,
        varianteStore: state.sistema.variante,
        costoUnitario: state.sistema.costoUnitario
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        recuperarContrasena: (correo, contrasena) => dispatch(recuperarContrasena(correo, contrasena)),
        actualizarUsuario: (correo, id_medidor) => dispatch(actualizarUsuario(correo, id_medidor)),
        crearUsuario: (correo, nombre, apellidos, id_medidor, cedula) => dispatch(crearUsuario(correo, nombre, apellidos, id_medidor, cedula)),
        eliminarUsuario: (correo) => dispatch(eliminarUsuario(correo)),
        actualizarCostoUnitario: (costoUnitario) => dispatch(actualizarCostoUnitario(costoUnitario)),
        cerrarSesionUsuario: (correo) => dispatch(cerrarSesionUsuario(correo)),
        ocultarAlerta: () => dispatch(ocultarAlerta())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);