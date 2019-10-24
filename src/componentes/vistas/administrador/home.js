//Componente
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Cargando from '../../cargando/cargando';
import { recuperarContrasena, actualizarUsuario, crearUsuario, eliminarUsuario, actualizarCostoUnitario } from '../../../redux/acciones/administradorAcciones';

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
    }

    render() {

        const { nombre, apellidos, correo, cedula, id_medidor, btnEditarCliente, mensajeInterno, varianteInterna, listaClientesLocal } = this.state;
        const { clientes, consultaLista, mensajeStore, varianteStore } = this.props;

        if (!consultaLista) {
            return <Cargando />
        }

        let listaTabla = [];//Lista final que usa la tabla

        listaClientes = clientes;//Usada solo para el filtro

        if(listaClientesLocal){//Lista que esta llena si solo si se esta filtrando
            listaTabla = listaClientesLocal;
        }else{
            listaTabla = clientes;
        }

        return (
            <div className="container">
                <div className="">
                    <input name="costoUnitario" className="form-control form-control-sm inputUser" placeholder="costo unitario sin puntos" type="Number" onChange={this._teclearFormulario} />
                </div>
                <Button type="button" className="mr-3 mb-4" size="sm" onClick={this._actualizarCostoUnitario}> Actualizar </Button>
                <Row>
                    <Col lg={3}>
                        <div className="tituloNuevoCliente">
                            <h6>Formulario de cliente</h6>
                        </div>

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
                            <input className="form-control" type="text" placeholder="Buscra a un cliente" aria-label="Search" onChange={this._filtrarCliente} />
                        </div>

                        {listaTabla.length > 0 ?
                            <div className="table-responsive">
                                <table className="table table-striped " style={{ fontSize: '13px' }}>
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Correo</th>
                                            <th scope="col">CC</th>
                                            <th scope="col">ID del medidor</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.map((cliente, index) =>
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{cliente.nombre + " " + cliente.apellidos}</td>
                                                <td>{cliente.correo}</td>
                                                <td>{cliente.cedula}</td>
                                                <td>{cliente.id_medidor}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">

                                                        <button className="btn btn-secondary btn-sm" onClick={() => this._editarCliente(cliente)}>Editar</button>
                                                        <button className="btn btn-secondary btn-sm" value={cliente.correo} onClick={this._recuperarContraseña}>Recuperar</button>
                                                        <button className="btn btn-danger btn-sm" value={cliente.correo} onClick={(evento) => this._eliminarCliente(evento, cliente.correo)}>Eliminar</button>

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
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        clientes: state.sistema.listaClientes,
        consultaLista: state.sistema.consultaLista,
        mensajeStore: state.sistema.mensaje,
        varianteStore: state.sistema.variante
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        recuperarContrasena: (correo, contrasena) => dispatch(recuperarContrasena(correo, contrasena)),
        actualizarUsuario: (correo, id_medidor) => dispatch(actualizarUsuario(correo, id_medidor)),
        crearUsuario: (correo, nombre, apellidos, id_medidor, cedula) => dispatch(crearUsuario(correo, nombre, apellidos, id_medidor, cedula)),
        eliminarUsuario: (correo) => dispatch(eliminarUsuario(correo)),
        actualizarCostoUnitario: (costoUnitario) => dispatch(actualizarCostoUnitario(costoUnitario))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);