import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import './ConsumoReal.css';
import { actualizarLimite } from "../../../redux/acciones/clienteAcciones";
import imgNoche from '../../../asset/images/Noche.png';
import imgMadrugada from '../../../asset/images/Madrugada.png';
import imgMañana from '../../../asset/images/Mañana.png';
import imgTarde from '../../../asset/images/Tarde.png';
import Cargando from '../../cargando/cargando';
import BarraEstado from './BarraEstado'
import GraficaPromedio from './GraficaPromedio';

class consumoReal extends Component {

    state = {
        selectKw: true,
        miNuevoLimite: 0,
        mensaje: false,
        fecha: ""
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

    _cambiarLimite = (evento) => {//Cambiar nombre
        evento.preventDefault();
        const { miNuevoLimite } = this.state;
        const { usuario } = this.props;
        let tipoLimite = 0;
        let primeraVez = false;
        if (!this.state.selectKw) {
            tipoLimite = 1;
        }
        if (this.props.tipoLimite === null) {
            primeraVez = true;
        }
        if (!miNuevoLimite || miNuevoLimite < 0) {
            this.setState({ mensaje: "Error debe definir un valor correcto." });
        } else {
            this.props.actualizarLimite(usuario.correo, miNuevoLimite, tipoLimite, primeraVez);
            this.setState({ miNuevoLimite: 0 });
        }
    }

    _cancelarLimite = (evento) => {
        evento.preventDefault();
        const { usuario } = this.props;
        this.props.actualizarLimite(usuario.correo, 0, 0, false);
        this.setState({ miNuevoLimite: 0 });
    }

    _teclearFormulario = (evento) => {
        const name = evento.target.name;
        const value = evento.target.value;
        this.setState({
            [name]: value
        });
    }

    _selectKw = () => {//Cambiar nombre
        if (this.state.selectKw) {
            this.setState({ selectKw: false });
        } else {
            this.setState({ selectKw: true });
        }

    }

    _cerrarAlerta = () => {
        this.setState({ mensaje: null });
    }

    _obtenerFechaActual = () => {
        const fechaActual = new Date();
        const fechaString = fechaActual.toDateString();
        const vectorFecha = fechaString.split(" ");
        let nombreDia = "--";
        switch (vectorFecha[0]) {
            case "Sat":
                nombreDia = "Sábado";
                break;
            case "Mon":
                nombreDia = "Lunes";
                break;
            case "Tue":
                nombreDia = "Martes";
                break;
            case "Wed":
                nombreDia = "Miércoles";
                break;
            case "Thu":
                nombreDia = "Jueves";
                break;
            case "Fri":
                nombreDia = "Viernes";
                break;
            default:
                break;
        }
        let nombreMes = "--";

        nombreMes = this._obtenerNombreMesHistorial(vectorFecha[1]);
        return nombreDia + " " + nombreMes[0] + nombreMes[1].toLowerCase() + nombreMes[2].toLowerCase() + " " + vectorFecha[2] + " " + vectorFecha[3];
    }

    _obtenerNombreMesHistorial = (numeroMes) => {

        if (numeroMes === 11 || numeroMes === "Nov") {
            return "NOVIEMBRE";
        } else if (numeroMes === 1 || numeroMes === "Jan") {
            return "ENERO";
        } else if (numeroMes === 2 || numeroMes === "Feb") {
            return "FEBRERO";
        } else if (numeroMes === 3 || numeroMes === "Mar") {
            return "MARZO";
        } else if (numeroMes === 4 || numeroMes === "Apr") {
            return "ABRIL";
        } else if (numeroMes === 5 || numeroMes === "May") {
            return "MAYO";
        } else if (numeroMes === 6 || numeroMes === "Jun") {
            return "JUNIO";
        } else if (numeroMes === 7 || numeroMes === "Jul") {
            return "JULIO";
        } else if (numeroMes === 8 || numeroMes === "Aug") {
            return "AGOSTO";
        } else if (numeroMes === 9 || numeroMes === "Sep") {
            return "SEPTIEMBRE";
        } else if (numeroMes === 10 || numeroMes === "Oct") {
            return "OCTUBRE";
        } else if (numeroMes === 12 || numeroMes === "Dec") {
            return "DICIEMBRE";
        }
    }

    _obtenerNombrePeriodo = (fecha_1, fecha_2) => {
        const arrayFecha_1 = fecha_1.split("/");
        const mes_1 = parseInt(arrayFecha_1[0]);

        const arrayFecha_2 = fecha_2.split("/");
        const mes_2 = parseInt(arrayFecha_2[0]);

        return this._obtenerNombreMesHistorial(mes_1) + " - " + this._obtenerNombreMesHistorial(mes_2);
    }

    _esMismaFecha = (fecha_1, fecha_2) => {
        let resultado = false;

        let mes_1 = fecha_1.split("/")[0];
        let mes_2 = fecha_2.split("/")[0];

        let dia_1 = fecha_1.split("/")[1];
        let dia_2 = fecha_2.split("/")[1];

        let año_1 = fecha_1.split("/")[2];
        let año_2 = fecha_2.split("/")[2];

        if (mes_1 === mes_2 && dia_1 === dia_2 && año_1 === año_2) {
            resultado = true;
        }

        return resultado;
    }

    _getDiferenciaFechas = (fecha_1, fecha_2) => {
        let fechaInicio = new Date(fecha_1).getTime();
        let fechaFin = new Date(fecha_2).getTime();

        let diff = fechaFin - fechaInicio;

        return diff / (1000 * 60 * 60 * 24);
    }

    _getNombreFechaBarra = (fecha_1) => {

        let mes_1 = parseInt(fecha_1.split("/")[0]);
        let dia_1 = fecha_1.split("/")[1];
        let año_1 = fecha_1.split("/")[2];

        return dia_1 + "-" + this._obtenerNombreMesHistorial(mes_1) + "-" + año_1[2] + año_1[3];
    }

    _getFechaVistaToServidor = (fecha) => {
        let arrayFecha = fecha.split("-");
        let dia = parseInt(arrayFecha[2]);
        let mes = parseInt(arrayFecha[1]);
        let año = arrayFecha[0];

        return mes+"/"+dia+"/"+año;
    }

    _getHistorial = (fecha, historialArray) => {
        let historial = null;

        for (let index = 0; index < historialArray.length; index++) {
            const element = historialArray[index];
            if(this._getFechaVistaToServidor(fecha) === element.fecha.split(",")[0]){
                historial = element;
                break;
            }
        }

        return historial;
    }

    _getPorcentajePeriodo = (fechaConsumoInicial, fechaConsumoFinal) => {
        //Esto devuelve el porcentaje de los días consumidos en el periodo de tiempo actual.
        if(fechaConsumoInicial && fechaConsumoFinal){
            let diferenciaFechas = this._getDiferenciaFechas(fechaConsumoInicial, fechaConsumoFinal);//Obtengo el 100% del periodo
            let fechaActual = new Date().toLocaleString('en-us', { hour12: true }).split(",")[0];
            let diferenciaFechas_2 = this._getDiferenciaFechas(fechaConsumoInicial, fechaActual);//Saber el numero de dias consumido
            //Ahora, ¿cuanto equivale el numero de dias consumido en el 100%?
            return Math.round((diferenciaFechas_2 * 100) / diferenciaFechas);
        }else{
            return 0;
        }
        
    }

    componentDidMount(){

        const {tipoLimite} = this.props;

        this.setState({
            fecha: this._castearFecha(new Date().toLocaleString('en-us', { hour12: true }).split(",")[0]),
            selectKw: tipoLimite && tipoLimite === 1 ? false : true
        });
    }

    render() {

        const { consumoMes, limite, tipoLimite, fechaConsumoInicial, fechaConsumoFinal, usuario, consumoRealCargado, limiteCargado, historialCargado, alertaCargada, sistemaCargado } = this.props;//tipolimite 1 = peso, 0 = kw
        const { selectKw, miNuevoLimite, mensaje, fecha } = this.state;
        
        let { costoU } = this.props;
        let { historialArray } = this.props;
        let nombreMes = "--";
        let porcentajeLimite = 0;
        let fechaActual2 = new Date().toLocaleString('en-us', { hour12: true }).split(",")[0];
        let porcentajePeriodo = this._getPorcentajePeriodo(fechaConsumoInicial, fechaConsumoFinal);

        if (!usuario || !consumoRealCargado || !limiteCargado || !historialCargado || !alertaCargada || !sistemaCargado) {
            return <Cargando />;
        }
        
        let historial = historialArray ? this._getHistorial(fecha, historialArray) : null;       

        if (fechaConsumoInicial && fechaConsumoFinal) {
            nombreMes = this._obtenerNombrePeriodo(fechaConsumoInicial, fechaConsumoFinal);
        }

        if (tipoLimite !== null && limite > 0) {//Tiene un limite definido

            if (tipoLimite === 0) {
                porcentajeLimite = Math.round((consumoMes * 100) / limite);
            } else {
                let costo = costoU * consumoMes;
                porcentajeLimite = Math.round((costo * 100) / limite);
            }
            if (porcentajeLimite > 100) {
                porcentajeLimite = 100;
            }
        }

        let costoPesos = consumoMes * costoU;

        costoPesos = costoPesos.toLocaleString('de-DE', { style: 'decimal' });
        
        return (
            <Row>
                {/* CONSUMO REAL */}
                <Col lg={12} md={12} xl={8} sm={12} xm={12}>
                    <Card style={{ minHeight: '535px' }} >
                        <Card.Body>
                            <Row className="container" style={{ marginBottom: "50px", marginTop: "20px" }}>
                                <Col id="linea" style={{ textAlign: 'center' }}>
                                    <i id="boltIcono" className="fas fa-bolt" title="ConsumoKwh"></i>
                                    <h3 className="textoConsumo mt-3">Consumo actual del período</h3>
                                    <p className="textoConsumo info">{nombreMes}</p>
                                    <h2 className="valor">{consumoMes}<span id="unidad" className="textoConsumo">Kw/h</span> </h2>
                                </Col>

                                <Col style={{ textAlign: 'center' }}>
                                    <i id="moneyIcono" className="fas fa-coins" title="ConsumoDinero"></i>
                                    <h3 className="textoConsumo mt-3">Costo actual del período</h3>
                                    <p className="textoConsumo info" >Costo por kw/h: ${costoU}</p>

                                    <h2 className="valor" id="costoKw">
                                        <i id="dollarIcono" className="fas fa-dollar-sign"></i>
                                        {costoPesos}
                                    </h2>
                                </Col>

                            </Row>
                            <BarraEstado 
                                porcentajeLimite={porcentajePeriodo}
                                valorActual={fechaActual2 ? this._getNombreFechaBarra(fechaActual2) : "--"}
                                limite={fechaConsumoFinal ? this._getNombreFechaBarra(fechaConsumoFinal): "--"}
                                inicio={fechaConsumoInicial ? this._getNombreFechaBarra(fechaConsumoInicial) : "--" }
                                unidadBarra={""} 
                                tema={"progress-c-theme"} 
                                altura={20} />
                        </Card.Body>
                    </Card>
                </Col>
                {/* LIMITE */}
                <Col lg={12} md={12} xl={4} sm={12} xm={12} >
                    <Card style={{ minHeight: '535px' }}>
                        <Card.Body id="limite">
                            {mensaje ?
                                <Alert variant="danger" style={{ backgroundColor: 'red' }} onClose={this._cerrarAlerta} dismissible>
                                    <h6 style={{ color: 'white', fontSize: '11px' }}>{mensaje}</h6>
                                </Alert>
                                : null
                            }
                            <div>
                                <Row>
                                    <Col lg={9} id="limiteCol" >
                                        <h3 id="limiteTitulo" className="textoLimite mt-4">Limite actual</h3>
                                    </Col>
                                    <Col lg={3}>
                                        <i id="flagIcono" className="feather icon-flag" />
                                    </Col>
                                </Row>
                            </div>
                            {tipoLimite !== null && limite > 0
                                ?
                                <div>
                                    <h2 id="hayLimite" className="textoConsumo">{tipoLimite === 0 ? limite + " kwh" : "$ " + limite}</h2>
                                    <BarraEstado porcentajeLimite={porcentajeLimite} valorActual={tipoLimite === 0 ? consumoMes : (consumoMes * costoU)} limite={limite} inicio={0} unidadBarra={tipoLimite === 0 ? "kwh" : "$"} />
                                </div>
                                :
                                <div className="mb-4">
                                    <h6 id="noLimite" className="textoConsumo"><i id="alertIcono" className="feather icon-alert-circle mr-1" /> No has definido un limite</h6>
                                </div>

                            }
                            <h6 className="textoLimite mt-3">Determina tu nuevo limite:</h6>
                            <div className="custom-control custom-switch mt-3">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch1" checked={selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label textoLimite" htmlFor="customSwitch1">Kilowatts por hora</label>
                            </div>
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch2" checked={!selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label textoLimite" htmlFor="customSwitch2">Pesos colombianos</label>
                            </div>
                            <div className="input-group mb-3 fondo mt-3">
                                <input type="number" className="form-control" value={miNuevoLimite} name='miNuevoLimite' placeholder="Cantidad" onChange={this._teclearFormulario} />
                            </div>
                            <Button className="mt-1 shadow-2 boton" onClick={this._cambiarLimite} variant="primary" size="sm">
                                Guardar
                            </Button>
                            <Button className="mt-1 shadow-2 boton" onClick={this._cancelarLimite} variant="primary" size="sm">
                                Eliminar limite
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                {/* HISTORIAL POR DIA */}
                <Col xl={12} lg={12} md={12} sm={12} xm={12} className="mt-3">
                    {historial === "ERROR" ?
                        <div>Ha ocurrido un error.</div>
                        :
                        <Row>
                            <Col xl={12} lg={12} md={12} sm={12} xm={12} className="textoConsumo mb-4">
                                <div className="mb-1" style={{justifyContent: "center", textAlign: "center"}}>
                                    <div style={{display: "inline-block"}} className="" htmlFor="Input_FechaRegistro">
                                        <h3>Consumo real para la fecha:</h3>
                                    </div>
                                    <div style={{display: "inline-block"}}>
                                        <input className="form-control ml-3" type="Date" name="fecha" id="Input_FechaRegistro" value={fecha} onChange={this._teclearFormulario}/>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={3} lg={12} md={12} sm={12} xm={12}>
                                <Card className="cardParteDia">
                                    <Card.Img className="imgParteDia" src={imgMadrugada} style={{ opacity: "0.4" }} alt="Madrugada" />
                                    <Card.ImgOverlay>
                                        <Card.Title style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
                                            Madrugada
                                    </Card.Title>
                                        <Card.Text>
                                            12:00 AM - 5:59 AM
                                        </Card.Text>
                                        <Card.Text style={{ color: "black" }}>
                                            <span className="valorParteDia">{historial && historial.consumoMadrugada ? historial.consumoMadrugada : "--"}<span className="unidadParteDia">{historial && historial.consumoMadrugada ? "Kw/h" : null}</span> </span>
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                            <Col xl={3} lg={12} md={12} sm={12} xm={12}>
                                <Card className="cardParteDia">
                                    <Card.Img className="imgParteDia" src={imgMañana} style={{ opacity: "0.4" }} alt="Mañana" />
                                    <Card.ImgOverlay>
                                        <Card.Title style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
                                            Mañana
                                    </Card.Title>
                                        <Card.Text>
                                            6:00 AM - 11:59 AM
                                        </Card.Text>
                                        <Card.Text style={{ color: "black" }}>
                                            <span className="valorParteDia">{historial && historial.consumoMañana ? historial.consumoMañana : "--"}<span className="unidadParteDia">{historial && historial.consumoMañana ? "Kw/h" : null}</span> </span>
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                            <Col xl={3} lg={12} md={12} sm={12} xm={12}>
                                <Card className="cardParteDia">
                                    <Card.Img className="imgParteDia" src={imgTarde} style={{ opacity: "0.4" }} alt="Tarde" />
                                    <Card.ImgOverlay>
                                        <Card.Title style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
                                            Tarde
                                    </Card.Title>
                                        <Card.Text>
                                            12:00 PM - 5:59 PM
                                        </Card.Text>
                                        <Card.Text style={{ color: "black" }}>
                                            <span className="valorParteDia">{historial && historial.consumoTarde ? historial.consumoTarde : "--"}<span className="unidadParteDia">{historial && historial.consumoTarde ? "Kw/h" : null}</span> </span>
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                            <Col xl={3} lg={12} md={12} sm={12} xm={12}>
                                <Card className="cardParteDia">
                                    <Card.Img className="imgParteDia" src={imgNoche} style={{ opacity: "0.4" }} alt="Noche" />
                                    <Card.ImgOverlay>
                                        <Card.Title style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
                                            Noche
                                    </Card.Title>
                                        <Card.Text>
                                            6:00 PM - 11:59 PM
                                        </Card.Text>
                                        <Card.Text style={{ color: "black" }}>
                                            <span className="valorParteDia">{historial && historial.consumoNoche ? historial.consumoNoche : "--"}<span className="unidadParteDia">{historial && historial.consumoNoche ? "Kw/h" : null}</span> </span>
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Col>
                        </Row>
                    }
                </Col>
                {/* GRÁFICA DE HISTORIAL ACTUAL */}
                <Col xl={12} lg={12} md={12} sm={12} xm={12} className="mt-3">
                    {historialArray && historialArray.length > 0 && <h3 className="textoConsumo mt-3" style={{textAlign: 'center'}} >Historico del período actual</h3>}
                    {historialArray && historialArray.length > 0 && <GraficaPromedio historial={historialArray} fechaConsumoInicial={fechaConsumoInicial} fechaConsumoFinal={fechaConsumoFinal} />}
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        consumoMes: state.consumo.consumoMes,
        limite: state.consumo.limite,
        tipoLimite: state.consumo.tipoLimite,
        usuario: state.autenticacion.usuario,
        historialArray: state.consumo.historial,
        consumoRealCargado: state.consumo.consumoRealCargado,
        limiteCargado: state.consumo.limiteCargado,
        historialCargado: state.consumo.historialCargado,
        alertaCargada: state.consumo.alertaCargada,
        sistemaCargado: state.sistema.sistemaCargado,
        costoU: state.sistema.costoUnitario,
        fechaConsumoInicial: state.sistema.fechaIniCorte,
        fechaConsumoFinal: state.sistema.fechaFinCorte,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actualizarLimite: (correo, limite, tipoLimite, primeraVez) => dispatch(actualizarLimite(correo, limite, tipoLimite, primeraVez))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(consumoReal);
