import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import '../cliente/ConsumoReal.css';
import { actualizarLimite } from "../../../redux/acciones/clienteAcciones";


class consumoReal extends Component {

    state = {
        selectKw: true,
        miNuevoLimite: 0,
        mensaje: false
    }

    _cambiarLimite = (evento) => {
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

    _selectKw = () => {
        if (this.state.selectKw) {
            this.setState({ selectKw: false });
        } else {
            this.setState({ selectKw: true });
        }

    }

    _cerrarAlerta = () => {
        this.setState({ mensaje: null });
    }

    render() {

        const { consumoMes, costoU, limite, tipoLimite } = this.props;//tipolimite 1 = peso, 0 = kw
        const { selectKw, miNuevoLimite, mensaje } = this.state;
        const fechaActual = new Date();

        let porcentajeLimite = 0;
        if (tipoLimite !== null && limite>0) {//Tiene un limite definido

            if (tipoLimite === 0) {
                porcentajeLimite = Math.round((consumoMes * 100) / limite);

            } else {
                let costo = costoU * consumoMes;
                porcentajeLimite = Math.round((costo * 100) / limite);

            }

        }

        return (
            <Row>
                <Col lg={8} md={12}>
                    <Card  style={{ minHeight: '500px' }} >
                        <Card.Body>
                            <Row className="container">
                                <Col id="linea" style={{ textAlign: 'center' }}>
                                    <i id="boltIcono" className="fas fa-bolt"></i>
                                    <h3 className="textoConsumo mt-3">Consumo actual</h3>
                                    <p className="textoConsumo info">{fechaActual.toDateString()}</p>
                                    <h2 className="valor">{consumoMes }<span id="unidad" className="textoConsumo">Kw/h</span> </h2>
                                </Col>

                                <Col style={{ textAlign: 'center' }}>
                                    <i id="moneyIcono" className="fas fa-coins"></i>
                                    <h3 className="textoConsumo mt-3">Costo</h3>
                                    <p className="textoConsumo info">Costo unitario: ${costoU}</p>

                                    <h2 className="valor">
                                        <i id="dollarIcono" className="fas fa-dollar-sign"></i>
                                        {consumoMes * costoU}
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
                            <div className="circulo textoConsumo shadow-2 mx-auto mt-3" style={{ textAlign: 'center' }}>{porcentajeLimite+"%"}</div>
                        </Card.Body>
                        
                    </Card>
                    
                </Col>
                <Col lg={4} md={12} >
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
        usuario: state.autenticacion.usuario
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actualizarLimite: (correo, limite, tipoLimite, primeraVez) => dispatch(actualizarLimite(correo, limite, tipoLimite, primeraVez))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(consumoReal);
