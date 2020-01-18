//Componente
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Cargando from '../../cargando/cargando';
import '../administrador/Administrador.css';
import { recuperarContrasena, actualizarUsuario, crearUsuario, eliminarUsuario, actualizarCostoUnitario, cerrarSesionUsuario, ocultarAlerta } from '../../../redux/acciones/administradorAcciones';
import { Card } from 'react-bootstrap';
import Api from '../../../api/Api';
import Aux from '../../_Aux/_Aux';
import Confirmar from '../../VentanaModal/Confirmacion';

let listaClientes = [];
let diasFacturar = 0;
let diasProxFacturar = 0;

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
        lugarMensajeInterno: null,
        varianteInterna: "",
        listaClientesLocal: null,
        tamañoListaCliente: 0,
        fechaIni: "",
        fechaFin: "",
        fechaFinProx: "",
        estadoModal: false,
        tituloModal: "",
        mensajeModal: "",
        correoRecuperar: null,
        accion: null,
        componenteListo: false,
        NO_puedeModificarFechasPeriodo: true
    }

    _getFechaActual = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
        dd = '0' + dd;
        } 
        if (mm < 10) {
        mm = '0' + mm;
        } 
        return yyyy + '-' + mm + '-' + dd;
    }

    _teclearFormulario = (evento) => {
        evento.preventDefault();
        const {fechaIni, fechaFin} = this.state;
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
        
        if("fechaIni" === name && this._getDiferenciaFechas(this._getFechaActual(), value) > 0){
            this.setState({fechaFin: "", fechaIni: this._getFechaActual()});
        }else if("fechaIni" === name){
            this.setState({fechaFin: ""});
        }
        if(fechaIni && "fechaFin" === name){
            if(this._getDiferenciaFechas(fechaIni, value) <= 0 || this._getDiferenciaFechas(fechaIni, value) > 31){
                this.setState({fechaFin: ""});
            }
        }
        if("fechaFinProx" === name){
            if(this._getDiferenciaFechas(fechaFin, value) <= 0 || this._getDiferenciaFechas(fechaFin, value) > 31){
                this.setState({fechaFinProx: ""});
            }
        }
    }

    _validaCorreo(correo) {
        var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(correo);
    }

    _filtrarCliente = (evento) => {

        const value = evento.target.value.trim();

        var filtro = listaClientes.filter((str) => {

            if (str.correo && str.nombre && str.apellidos && str.id_medidor && str.cedula) {
                console.log()
                return str.nombre.toLowerCase().includes(value.toLowerCase()) ||
                    str.correo.toLowerCase().includes(value.toLowerCase()) ||
                    str.apellidos.toLowerCase().includes(value.toLowerCase()) ||
                    str.id_medidor.toString().includes(value) ||
                    str.cedula.toString().includes(value);
            } else {
                return null;
            }
        });

        if (value) {
            this.setState({
                listaClientesLocal: filtro, tamañoListaCliente: listaClientes.length
            });
        } else {
            this.setState({
                listaClientesLocal: null, tamañoListaCliente: 0
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

    _cerrarVentanaModal = () => {
        this.setState({correoRecuperar: null, estadoModal: false, tituloModal: "", mensajeModal: "", accion: null});
    }

    _recuperarContraseña = (evento) => {

        const correo = evento;
        this.setState({correoRecuperar: correo, estadoModal: true, tituloModal: "Recuperar contraseña", mensajeModal: "Estas seguro de reestablecer la contraseña para el correo: "+correo+" ?", accion: 1});
        
    }

    _eliminarCliente = (evento, correo) => {
        evento.preventDefault();
        this.setState({correoRecuperar: correo, estadoModal: true, tituloModal: "Eliminar cliente", mensajeModal: "Estas seguro de eliminar al cliente con correo: "+correo+" ?", accion: 2});
    }

    _actualizarCliente = (evento) => { /*KAREEEEEEEEEEEEEEEEEEEEN*/
        evento.preventDefault();
        const { id_medidor, correo } = this.state;

        if (!id_medidor) {
            this.setState({ mensajeInterno: "No deben haber campos vacios", varianteInterna: "danger", lugarMensajeInterno: 2 });
        } else {
            this.props.actualizarUsuario(correo, id_medidor);
        }

    }

    _nuevoCliente = () => {

        const { correo, nombre, apellidos, id_medidor, cedula } = this.state;

        if (correo === "" || nombre === "" || id_medidor === "" || apellidos === "" || cedula === "" || !this._validaCorreo(correo)) {
            this.setState({ mensajeInterno: "No debe haber campos vacios y el correo debe ser valido", varianteInterna: "danger", lugarMensajeInterno: 2 });
        } else {
            this.props.crearUsuario(correo.trim(), nombre.trim(), apellidos.trim(), id_medidor, cedula);
        }

    }

    _actualizarCostoUnitario = (evento) => {
        evento.preventDefault();
        if (this.state.costoUnitario > 0) {
            this.props.actualizarCostoUnitario(this.state.costoUnitario);
        } else {
            this.setState({ mensajeInterno: "Debe diligenciar un costo unitario valido", varianteInterna: "danger", lugarMensajeInterno: 0 });
        }
    }

    _cerrarSesionUsuario = (evento, correo) => {
        evento.preventDefault();
        this.setState({correoRecuperar: correo, estadoModal: true, tituloModal: "Cerrar sesion", mensajeModal: "Estas seguro de cerrar la sesion para el correo: "+correo+" ?", accion: 3});
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

    _castearFecha = (fecha) => {
        let arrayFecha = fecha.split("/");
        let dia = parseInt(arrayFecha[1]);
        let mes = parseInt(arrayFecha[0]);
        let año = arrayFecha[2];

        if(dia < 10){
            dia = "0"+dia;
        }

        if(mes < 10){
            mes = "0"+mes;
        }

        return año+"-"+mes+"-"+dia;
    }

    _getFechaToVista = (fecha) => {
        let arrayFecha = fecha.split("/");
        let dia = parseInt(arrayFecha[1]);
        let mes = parseInt(arrayFecha[0]);
        let año = arrayFecha[2];

        let mesString = ""+mes;
        let diaString = ""+dia;
        if(mes < 10){
            mesString = "0"+mes;
        }
        if(dia < 10){
            diaString = "0"+diaString;
        }

        return {
            dia:diaString , mes:mesString , año
        }
    }

    _getFechaToServidor = (fecha) => {
        let arrayFecha = fecha.split("-");
        let dia = parseInt(arrayFecha[2]);
        let mes = parseInt(arrayFecha[1]);
        let año = arrayFecha[0];

        return {
            dia, mes, año
        }
    }

    _getDiferenciaFechas = (fecha_1, fecha_2) => {
        let fechaInicio = new Date(fecha_1).getTime();
        let fechaFin    = new Date(fecha_2).getTime();

        let diff = fechaFin - fechaInicio;

        return diff/(1000*60*60*24);
    }

    _sumarDiasFecha = (fecha, Ndia) => {
        let nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + Ndia);
        let mes = parseInt((nuevaFecha.getMonth() + 1));
        let dia = parseInt(nuevaFecha.getDate());
        let mesString = ""+mes;
        let diaString = ""+dia;
        if(mes < 10){
            mesString = "0"+mes;
        }
        if(dia < 10){
            diaString = "0"+diaString;
        }

        return nuevaFecha.getFullYear() + '-' + mesString + '-' + diaString;
    }

  

    _actualizarProximaFechaPeriodo = async () => {
        const { fechaFin, fechaFinProx } = this.state;

        if(!fechaFinProx || !fechaFin){
            this.setState({ mensajeInterno: "Debe escoger un período valido", varianteInterna: "danger", lugarMensajeInterno: 1 });
        }else if(this._getDiferenciaFechas(fechaFin, fechaFinProx) <= 0){
            this.setState({ mensajeInterno: "Debe escoger un período valido", varianteInterna: "danger", lugarMensajeInterno: 1 });
        }else{
            let fecha_11 = this._getFechaToServidor(fechaFin).mes + "/" + this._getFechaToServidor(fechaFin).dia + "/" + this._getFechaToServidor(fechaFin).año;
            let fecha_22 = this._getFechaToServidor(fechaFinProx).mes + "/" + this._getFechaToServidor(fechaFinProx).dia + "/" + this._getFechaToServidor(fechaFinProx).año;

            if(this._getDiferenciaFechas(this._getFechaActual(), fechaFin) <= 0){//Estamos en un nuevo periodo
               
                let fecha_1 = this._getFechaToServidor(fechaFin).mes + "/" + this._getFechaToServidor(fechaFin).dia + "/" + this._getFechaToServidor(fechaFin).año;
                let fecha_2 = this._getFechaToServidor(fechaFinProx).mes + "/" + this._getFechaToServidor(fechaFinProx).dia + "/" + this._getFechaToServidor(fechaFinProx).año;

                const resultado = await Api.guardarFechaPeriodo(fecha_1, fecha_2);

                if(resultado.estado === true){
                    this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "success", lugarMensajeInterno: 1, fechaIni: fechaFin, fechaFin: fechaFinProx });
                }else{
                    this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "danger", lugarMensajeInterno: 1 });
                }

            }else{//Actualizamos la proxima fecha de periodo en la base de datos
                const resultado = await Api.guardarProxFechaPeriodo(fecha_11, fecha_22);

                if(resultado.estado === true){
                    this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "success", lugarMensajeInterno: 1 });
                }else{
                    this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "danger", lugarMensajeInterno: 1 });
                }
            }
        }

    }

    _actualizarFechaPeriodo = async () => {
        const { fechaIni, fechaFin } = this.state;

        if(!fechaIni || !fechaFin){
            this.setState({ mensajeInterno: "Debe escoger un período valido", varianteInterna: "danger", lugarMensajeInterno: 1 });
        }else if(this._getDiferenciaFechas(fechaIni, fechaFin) <= 0){
            this.setState({ mensajeInterno: "Debe escoger un período valido", varianteInterna: "danger", lugarMensajeInterno: 1 });
        }else{
            let fecha_1 = this._getFechaToServidor(fechaIni).mes + "/" + this._getFechaToServidor(fechaIni).dia + "/" + this._getFechaToServidor(fechaIni).año;
            let fecha_2 = this._getFechaToServidor(fechaFin).mes + "/" + this._getFechaToServidor(fechaFin).dia + "/" + this._getFechaToServidor(fechaFin).año;
            const resultado = await Api.guardarFechaPeriodo(fecha_1, fecha_2);
            if(resultado.estado === true){
                this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "success", lugarMensajeInterno: 1 });
                await this._consultarCostoUnitario();
            }else{
                this.setState({ mensajeInterno: resultado.mensaje, varianteInterna: "danger", lugarMensajeInterno: 1 });
            }
        }
    }

    _metodoAceptar = (evento) => {
        evento.preventDefault();

        const {correoRecuperar, accion} = this.state;
        
        switch(accion){
            case 1://Recuperar contraseña
                this.props.recuperarContrasena(correoRecuperar, correoRecuperar);//correo y nueva clave
                break;
            case 2://Eliminar usuario
                this.props.eliminarUsuario(correoRecuperar);
                break;
            case 3://Cerrar sesion
                this.props.cerrarSesionUsuario(correoRecuperar);
                break;
            default:
                break;
        }

        this._cerrarVentanaModal();
    }

    componentDidUpdate = () => {
        const {limpiarCampos} = this.state;
        const {fechaIni, fechaFin, fechaFinProx} = this.state;
        const { fechaFinCorte } = this.props;
        
        // if( (fechaIniCorte || fechaFinCorte) && !fechaIni && !fechaFin && stateCargado){
            
        //     this.setState({
        //         fechaIni: this._getFechaToVista(fechaIniCorte).año+"-"+this._getFechaToVista(fechaIniCorte).mes+"-"+this._getFechaToVista(fechaIniCorte).dia, 
        //         fechaFin: this._getFechaToVista(fechaFinCorte).año+"-"+this._getFechaToVista(fechaFinCorte).mes+"-"+this._getFechaToVista(fechaFinCorte).dia,
        //         fechaFinProx: this._sumarDiasFecha(this._getFechaToVista(fechaFinCorte).año+"-"+this._getFechaToVista(fechaFinCorte).mes+"-"+this._getFechaToVista(fechaFinCorte).dia, 31)
        //     });
        // }

        if(!fechaFinProx && fechaFinCorte){
            this.setState({fechaFinProx: this._sumarDiasFecha(this._getFechaToVista(fechaFinCorte).año+"-"+this._getFechaToVista(fechaFinCorte).mes+"-"+this._getFechaToVista(fechaFinCorte).dia, 31)});
        }

        if(limpiarCampos){
            this._limpiarInputs();
            this.props.camposLimpios();
        }

        if(fechaIni && !fechaFin){
            let nuevaFecha = new Date(fechaIni);
            nuevaFecha.setDate(nuevaFecha.getDate() + 31);
            let mes = parseInt((nuevaFecha.getMonth() + 1));
            let dia = parseInt(nuevaFecha.getDate());
            let mesString = ""+mes;
            let diaString = ""+dia;
            if(mes < 10){
                mesString = "0"+mes;
            }
            if(diaString < 10){
                diaString = "0"+diaString;
            }
            this.setState({
                fechaFin: nuevaFecha.getFullYear() + '-' + mesString + '-' + diaString  
            });
        }
    }

    _consultarCostoUnitario = async () => {
        const res = await Api.consultarCostoUnitario();

        const {costoUnitario, fechaIniCorte, fechaFinCorte, estado} = res;

        if(estado && fechaIniCorte && fechaFinCorte){
            this.setState({
                fechaIni: this._getFechaToVista(fechaIniCorte).año+"-"+this._getFechaToVista(fechaIniCorte).mes+"-"+this._getFechaToVista(fechaIniCorte).dia, 
                fechaFin: this._getFechaToVista(fechaFinCorte).año+"-"+this._getFechaToVista(fechaFinCorte).mes+"-"+this._getFechaToVista(fechaFinCorte).dia,
                fechaFinProx: this._sumarDiasFecha(this._getFechaToVista(fechaFinCorte).año+"-"+this._getFechaToVista(fechaFinCorte).mes+"-"+this._getFechaToVista(fechaFinCorte).dia, 31),
                componenteListo: true,
                NO_puedeModificarFechasPeriodo: true
            });
            
        }else{
            this.setState({
                componenteListo: true,
                NO_puedeModificarFechasPeriodo: false
            });
        }        
        this.props.actualizarDatosSistema(costoUnitario, fechaIniCorte, fechaFinCorte);
    }

    async componentDidMount() {
        await this._consultarCostoUnitario();
    }

    render() {

        const { nombre, apellidos, correo, cedula, id_medidor, btnEditarCliente, mensajeInterno, varianteInterna, listaClientesLocal, tamañoListaCliente, fechaIni, fechaFin, lugarMensajeInterno, fechaFinProx, estadoModal, tituloModal, mensajeModal, componenteListo, NO_puedeModificarFechasPeriodo } = this.state;
        const { clientes, mensajeStore, varianteStore, costoUnitario, creadoCliente} = this.props;

        if (!componenteListo) {
            return <Cargando />;
        }

        // let NO_puedeModificarFechasPeriodo = fechaIniCorte || fechaFinCorte ? true : false;
        
        if(fechaIni && fechaFin){
            diasFacturar = this._getDiferenciaFechas(fechaIni, fechaFin);
        }

        if(fechaFinProx){
            diasProxFacturar = this._getDiferenciaFechas(fechaFin, fechaFinProx);
        }

        let listaTabla = [];//Lista final que usa la tabla

        listaClientes = clientes;//Usada solo para el filtro

        if (listaClientesLocal && (clientes.length === tamañoListaCliente)) {//Lista que esta llena si solo si se esta filtrando
            listaTabla = listaClientesLocal;
        } else {
            listaTabla = clientes;
        }

        return (

            <div className="container">
                {mensajeStore
                                                ?
                                                <Alert variant={varianteStore} onClose={this._cerrarAlerta} dismissible>
                                                    <h6 style={{ color: 'black', fontSize: '11px' }}>{mensajeStore}</h6>
                                                </Alert>: null}
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

                <Col lg={12}>
                    <Card className="mb-4">
                        <Card.Body className="cuerpo" >
                            <Row className="fila">
                                <Col lg={12}>
                                    <h5 className="textoAdmin">Determina fechas del período</h5>
                                </Col>
                                <Col lg={12}>
                                    {mensajeInterno && lugarMensajeInterno === 1 ?
                                        <Alert variant={varianteInterna} onClose={this._cerrarAlerta} dismissible>
                                            <h6 style={{ color: 'black', fontSize: '11px' }}>{mensajeInterno}</h6>
                                        </Alert>
                                        :null}
                                </Col>
                            </Row>
                            <Row className="fila">
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label forhtml="nombre">Fecha actual inicial</label>
                                        <input name="fechaIni" className="form-control form-control-sm inputUser textoAdmin" type="date" value={fechaIni} onChange={this._teclearFormulario} disabled={NO_puedeModificarFechasPeriodo}/>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="form-group">
                                        <label forhtml="nombre">Fecha actual final</label>
                                        <input name="fechaFin" className="form-control form-control-sm inputUser textoAdmin" type="date" value={fechaFin} onChange={this._teclearFormulario} disabled={NO_puedeModificarFechasPeriodo}/>
                                    </div>
                                </Col>
                                <Col lg={12} style={{marginBottom:"20px"}}>
                                    <label forhtml="nombre">Días actuales a facturar: {diasFacturar} </label>
                                </Col>
                                {NO_puedeModificarFechasPeriodo === true ? 
                                    <Aux > 
                                        <Col lg={6}>
                                        <div className="form-group">
                                            <label forhtml="nombre">Fecha próxima inicial</label>
                                            <input name="fechaIni" className="form-control form-control-sm inputUser textoAdmin" type="date" value={fechaFin} onChange={this._teclearFormulario} disabled={NO_puedeModificarFechasPeriodo}/>
                                        </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form-group">
                                                <label forhtml="nombre">Fecha próxima final</label>
                                                <input name="fechaFinProx" className="form-control form-control-sm inputUser textoAdmin" type="date" value={fechaFinProx} onChange={this._teclearFormulario} />
                                            </div>
                                        </Col>
                                        <Col lg={12} style={{marginBottom:"20px"}}>
                                            <label forhtml="nombre">Días próximos a facturar: {diasProxFacturar} </label>
                                        </Col>
                                    </Aux>
                                    :null
                                }
                                <Col>
                                    {diasFacturar !== 30 && fechaFin && fechaIni && NO_puedeModificarFechasPeriodo === false? 
                                        <Alert variant={"warning"}>
                                            <h6 style={{ color: 'black', fontSize: '11px' }}>{"Se recomienda que el período de facturación comprenda un lapso de 30 días."}</h6>
                                        </Alert>: fechaFin && diasProxFacturar !== 30 && NO_puedeModificarFechasPeriodo === true ? 
                                            <Alert variant={"warning"}>
                                            <h6 style={{ color: 'black', fontSize: '11px' }}>{"Se recomienda que el período de facturación comprenda un lapso de 30 días."}</h6>
                                        </Alert>: null}
                                    
                                    <div className="form-group">
                                        <Button type="button" className="mr-3 mb-4 textoAdmin botonCu" size="sm" onClick={NO_puedeModificarFechasPeriodo === true ? this._actualizarProximaFechaPeriodo : this._actualizarFechaPeriodo}> 
                                            {NO_puedeModificarFechasPeriodo === true ? "Guardar" : "Actualizar"} 
                                        </Button>
                                    </div>
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
                                                mensajeInterno && lugarMensajeInterno === 2
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
                                                        <button type="submit" className="btn btn-primary btn-sm mr-3 btn-newUser inputUser" onClick={this._nuevoCliente} disabled={creadoCliente}>
                                                            Crear
                                                        </button>
                                                    }
                                                    <button type="submit" className="btn btn-danger btn-sm btn-newUser inputUser" onClick={this._limpiarInputs} disabled={creadoCliente}>
                                                        Cancelar
                                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                    </Col>
                                    <Confirmar estado={estadoModal} ocultarVentana={this._cerrarVentanaModal} metodoAceptar={this._metodoAceptar} titulo={tituloModal} mensaje={mensajeModal} />
                                    <Col lg={9}>
                                        {/* Alerta de algun error */}

                                        <div className="filtroCliente mb-4">
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
                                                        {listaTabla.map((cliente, index) =>
                                                            <tr key={index}>
                                                                <td>{cliente.nombre}</td>
                                                                <td>{cliente.correo}</td>
                                                                <td>{cliente.cedula}</td>
                                                                <td>{cliente.id_medidor}</td>
                                                                <td>
                                                                    <div className="btn-group btn-group-sm" role="group">

                                                                        <button title="Editar" className="btn btn-secondary btn-sm botonAdmin" style={{ padding: '0.5', fontSize: '12px' }} onClick={() => this._editarCliente(cliente)}>
                                                                            <i className="feather icon-edit"></i>
                                                                        </button>
                                                                        <button title="Recuperar contraseña" className="btn btn-secondary btn-sm botonAdmin" style={{ padding: '0.5', fontSize: '12px' }} onClick={() => this._recuperarContraseña(cliente.correo)}>
                                                                            <i className="feather icon-refresh-ccw"></i>
                                                                        </button>
                                                                        <button title="Eliminar" className="btn btn-danger btn-sm botonAdmin mx-auto" style={{ padding: '0.5', fontSize: '12px' }} value={cliente.correo} onClick={(evento) => this._eliminarCliente(evento, cliente.correo)}><i className="feather icon-trash"></i></button>
                                                                        <button title="Cerrar sesion" className="btn btn-danger btn-sm botonAdmin mx-auto" style={{ padding: '0.5', fontSize: '12px' }} value={cliente.correo} onClick={(evento) => this._cerrarSesionUsuario(evento, cliente.correo)}><i className="feather icon-log-out"></i></button>
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
        costoUnitario: state.sistema.costoUnitario,
        fechaIniCorte: state.sistema.fechaIniCorte,
        fechaFinCorte: state.sistema.fechaFinCorte,
        creadoCliente: state.sistema.creadoCliente,
        limpiarCampos: state.sistema.limpiarCampos,
        sistemaCargado: state.sistema.sistemaCargado,
        usuario: state.autenticacion.usuario,
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
        ocultarAlerta: () => dispatch(ocultarAlerta()),
        camposLimpios: () => dispatch({ type: "CAMPOS_LIMPIOS"}),
        actualizarDatosSistema: (costoUnitario, fechaIniCorte, fechaFinCorte) => dispatch({ type: "COSTO_UNITARIO", costoUnitario, fechaIniCorte, fechaFinCorte})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);