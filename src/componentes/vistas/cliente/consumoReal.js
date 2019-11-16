import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import '../cliente/ConsumoReal.css';
import { actualizarLimite } from "../../../redux/acciones/clienteAcciones";
import imgNoche from '../../../asset/images/Noche.png';
import imgMadrugada from '../../../asset/images/Madrugada.png';
import imgMañana from '../../../asset/images/Mañana.png';
import imgTarde from '../../../asset/images/Tarde.png';

class consumoReal extends Component {

    state = {
        selectKw: true,
        miNuevoLimite: 0,
        mensaje: false
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
                nombreDia =  "Sábado";
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
        return nombreDia + " " + nombreMes[0]+nombreMes[1].toLowerCase()+nombreMes[2].toLowerCase() +" "+  vectorFecha[2] + " " + vectorFecha[3];
    }

    _obtenerNombreMesHistorial = (numeroMes) => {

        if(numeroMes === 11 || numeroMes === "Nov"){
            return "NOVIEMBRE";
        }else if(numeroMes === 1 || numeroMes === "Jan"){
            return "ENERO";
        }else if(numeroMes === 2 || numeroMes === "Feb"){
            return "FEBRERO";
        }else if(numeroMes === 3 || numeroMes === "Mar"){
            return "MARZO";
        }else if(numeroMes === 4 || numeroMes === "Apr"){
            return "ABRIL";
        }else if(numeroMes === 5 || numeroMes === "May"){
            return "MAYO";
        }else if(numeroMes === 6 || numeroMes === "Jun"){
            return "JUNIO";
        }else if(numeroMes === 7 || numeroMes === "Jul"){
            return "JULIO";
        }else if(numeroMes === 8 || numeroMes === "Aug"){
            return "AGOSTO";
        }else if(numeroMes === 9 || numeroMes === "Sep"){
            return "SEPTIEMBRE";
        }else if(numeroMes === 10 || numeroMes === "Oct"){
            return "OCTUBRE";
        }else if(numeroMes === 12 || numeroMes === "Dec"){
            return "DICIEMBRE";
        }
    }

    render() {

        const { consumoMes, limite, tipoLimite, historial } = this.props;//tipolimite 1 = peso, 0 = kw
        const { selectKw, miNuevoLimite, mensaje } = this.state;
        const fechaActual = this._obtenerFechaActual();
        let { costoU } = this.props;
        let nombreMes = "--";
        if(historial){
            let vectorCadena = historial.fecha.split(",");
            let vectorFecha = vectorCadena[0].split("/");
            let numeroMes = vectorFecha[0];
            nombreMes = this._obtenerNombreMesHistorial(+numeroMes);
        }
        let porcentajeLimite = 0;
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
                <Col lg={12} md={12} xl={8} sm={12} xm={12}>
                    <Card style={{ minHeight: '500px' }} >
                        <Card.Body>
                            <Row className="container">
                                <Col id="linea" style={{ textAlign: 'center' }}>
                                    <i id="boltIcono" className="fas fa-bolt"></i>
                                    <h3 className="textoConsumo mt-3">Consumo actual</h3>
                                    <p className="textoConsumo info">{nombreMes}</p>
                                    <h2 className="valor">{consumoMes}<span id="unidad" className="textoConsumo">Kw/h</span> </h2>
                                </Col>

                                <Col style={{ textAlign: 'center' }}>
                                    <i id="moneyIcono" className="fas fa-coins"></i>
                                    <h3 className="textoConsumo mt-3">Costo</h3>
                                    <p className="textoConsumo info" >Costo unitario: ${costoU}</p>

                                    <h2 className="valor" id="costoKw">
                                        <i id="dollarIcono" className="fas fa-dollar-sign"></i>
                                        {costoPesos}
                                    </h2>
                                </Col>

                            </Row>
                            <Row className="container">
                                <Col lg={12}>
                                    <div className="progress m-t-30" style={{ height: '10px' }}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: porcentajeLimite + "%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </Col>

                            </Row>
                            <div className="circulo textoConsumo shadow-2 mx-auto mt-3" style={{ textAlign: 'center' }}>{porcentajeLimite + "%"}</div>
                        </Card.Body>

                    </Card>

                </Col>
                <Col lg={12} md={12} xl={4} sm={12} xm={12} >
                    <Card style={{ minHeight: '500px' }}>
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
                                <h2 id="hayLimite" className="textoConsumo">{tipoLimite === 0 ? limite + " kwh" : "$ " + limite}</h2>
                                :
                                <div className="mb-4">
                                    <h6 id="noLimite" className="textoConsumo"><i id="alertIcono" className="feather icon-alert-circle mr-1" /> No has definido un limite</h6>
                                </div>

                            }
                            <h6 className="textoLimite">Determina tu nuevo limite:</h6>
                            <div className="custom-control custom-switch mt-3">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch1" checked={selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label textoLimite" htmlFor="customSwitch1">Kilowatts por hora</label>
                            </div>
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch2" checked={!selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label textoLimite" htmlFor="customSwitch2">Pesos colombianos</label>
                            </div>
                            <div className="input-group mb-3 fondo mt-2">
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
                <Col xl={12} lg={12} md={12} sm={12} xm={12}>
                    {historial === "ERROR" ?
                        <div>Ha ocurrido un error.</div>
                        :
                        <Row>
                            <Col xl={12} lg={12} md={12} sm={12} xm={12} className="textoConsumo mb-4">
                                <h3>Consumo actual | {fechaActual}</h3>
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
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        consumoMes: state.consumo.consumoMes,
        costoU: state.consumo.costoU,
        limite: state.consumo.limite,
        tipoLimite: state.consumo.tipoLimite,
        usuario: state.autenticacion.usuario,
        historial: state.consumo.historial
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actualizarLimite: (correo, limite, tipoLimite, primeraVez) => dispatch(actualizarLimite(correo, limite, tipoLimite, primeraVez))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(consumoReal);
