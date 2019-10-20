//Componente
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Cargando from '../../cargando/cargando';
import { recuperarContrasena } from '../../../redux/acciones/administradorAcciones';

export class Home extends Component {

    state = {
        costoUnitario: 0,
        nombre: "",
        apellidos: "",
        correo: "",
        cedula: "",
        id_medidor: "",
        btnEditarCliente: false
    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    _filtrarCliente = (evento) => {

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
        this.props.recuperarContrasena(correo, correo);

    }

    _eliminarCliente = (evento) => {

    }

    _actualizarCliente = () => {

    }

    _nuevoCliente = () => {

    }

    _limpiarInputs = () => {

    }

    _cerrarAlerta = () => {
        
    }

    render() {

        const { nombre, apellidos, correo, cedula, id_medidor, btnEditarCliente } = this.state;
        const { clientes, consultaLista, mensajeStore, varianteStore } = this.props;

        if (!consultaLista) {
            return <Cargando />
        }

        return (
            <div className="container">
                <div className="">
                    <input name="costoUnitario" className="form-control form-control-sm inputUser" placeholder="costo unitario" type="Number" onChange={this._teclearFormulario} />
                </div>
                <Button type="button" className="mr-3 mb-4" size="sm"> Actualizar </Button>
                <Row>
                    <Col lg={4}>
                        <div className="tituloNuevoCliente">
                            <h6>Formulario de cliente</h6>
                        </div>

                        <div className="card mx-auto cardComponent">
                            {mensajeStore
                                ?
                                <Alert variant={varianteStore} style={{ backgroundColor: 'green' }} onClose={this._cerrarAlerta} dismissible>
                                    <h6 style={{ color: 'white', fontSize: '11px' }}>{mensajeStore}</h6>
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
                    <Col lg={8}>
                        {/* Alerta de algun error */}

                        <div className="filtroCliente">
                            <input className="form-control" type="text" placeholder="Search a user by name or email" aria-label="Search" onChange={this._filtrarCliente} />
                        </div>

                        {clientes.length > 0 ?
                            <div className="table-responsive-lg">
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
                                                        <button className="btn btn-danger btn-sm" value={cliente.correo} onClick={this._eliminarCliente}>Eliminar</button>

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
        recuperarContrasena: (correo, contrasena) => dispatch(recuperarContrasena(correo, contrasena))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);