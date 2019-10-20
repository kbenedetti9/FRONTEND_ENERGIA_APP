import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';
import { Card, Row, Col, Button } from 'react-bootstrap';
import '../cliente/ConsumoReal.css';
import { actualizarLimite } from "../../../redux/acciones/clienteAcciones";



class consumoReal extends Component {

    state = {
        selectKw: true,
        miNuevoLimite: 0

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
        if (miNuevoLimite === 0) {
            console.log("esta en cero")
        } else {
            this.props.actualizarLimite(usuario.correo, miNuevoLimite, tipoLimite, primeraVez);
            this.setState({miNuevoLimite:0});
        }
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

    render() {

        const { consumoMes, costoU, limite, tipoLimite } = this.props;//tipolimite 1 = peso, 0 = kw
        const { selectKw, miNuevoLimite } = this.state;
        const fechaActual = new Date();

        let porcentajeLimite = 0;
        if (tipoLimite !== null) {

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
                    <Card style={{ minHeight: '400px' }}>
                        <Card.Body>
                            <Row className="container">
                                <Col id="prueba" style={{ textAlign: 'center' }}>
                                    <i id="boltIcon" className="fas fa-bolt"></i>
                                    <h3 className="consumoTitle mt-3">Consumo actual</h3>
                                    <p id="fecha">{fechaActual.toDateString()}</p>
                                    <h2 id="consumo" className="numero">{consumoMes + " kw/h"}</h2>
                                </Col>

                                <Col style={{ textAlign: 'center' }}>
                                    <i id="moneyIcon" className="fas fa-coins"></i>
                                    <h3 className="consumoTitle costoTitle mt-3">Costo</h3>
                                    <p id="unitario" className="numero">Costo unitario: ${costoU}</p>

                                    <h2 id="costo" className="numero">
                                        <i id="dollarIcon" className="fas fa-dollar-sign"></i>
                                        {consumoMes * costoU}
                                    </h2>
                                </Col>

                            </Row>
                            <Row className="container">
                                <Col lg={12}>
                                    <div className="progress m-t-30" style={{ height: '10px' }}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: porcentajeLimite+ "%"}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={12}>
                    <Card style={{ minHeight: '400px' }}>
                        <Card.Body className="limite">
                            <div className="mb-4">
                                <Row>
                                    <Col lg={8}>
                                        <h3 id="limiteTitle" className="texto">Limite actual</h3>
                                    </Col>
                                    <Col lg={4}>
                                        <i className="feather icon-flag" />
                                    </Col>
                                </Row>
                            </div>
                            {tipoLimite !== null && limite
                                ?
                                <h2>{tipoLimite === 0 ? limite + " kwh" : "$ " + limite}</h2>
                                :
                                <div className="mb-4">
                                    <h6 id="noLimite" className="texto"><i className="feather icon-alert-circle mr-1" /> No has definido un limite</h6>
                                </div>

                            }
                            <h6 className="texto">Determina tu nuevo limite:</h6>
                            <div className="custom-control custom-switch mt-3">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch1" checked={selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label texto" htmlFor="customSwitch1">Kilowatts por hora</label>
                            </div>
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input switch" id="customSwitch2" checked={!selectKw} onChange={this._selectKw} />
                                <label className="custom-control-label texto" htmlFor="customSwitch2">Pesos colombianos</label>
                            </div>
                            <div className="input-group mb-3 fondo mt-2">
                                <input type="number" className="form-control" value={miNuevoLimite} name='miNuevoLimite' placeholder="Cantidad" onChange={this._teclearFormulario} />
                            </div>
                            <Button className="mt-1 editar shadow-2" onClick={this._cambiarLimite} variant="primary" size="sm">
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
