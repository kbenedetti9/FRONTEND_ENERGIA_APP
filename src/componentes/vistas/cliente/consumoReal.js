import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';
import { Card, Row, Col, Button } from 'react-bootstrap';


class consumoReal extends Component {


    render() {

        const { consumoMes, costoU, limite, tipoLimite } = this.props;
        const fechaActual = new Date();
        console.log(limite);
        console.log(tipoLimite);
        return (
            <Row>
                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <h3>Consumo actual</h3>
                                    <p>{fechaActual.toDateString()}</p>
                                    <h2>{consumoMes + " kw/h"} </h2>
                                </Col>
                                <Col>
                                    <h3>Costo</h3>
                                    <h2>{"$" + consumoMes*costoU} </h2>
                                </Col>

                            </Row>
                            <Row>
                                <Col lg={11}>
                                    <div className="progress m-t-30" style={{ height: '10px' }}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </Col>
                                <Col lg={1}>
                                    <p>50%</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                </Col>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <h3>Limite actual</h3>
                            {tipoLimite && limite ? <h2>{limite}</h2> :  <h6>No has definido un limite</h6> }
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="customSwitch1" />
                                <label className="custom-control-label" htmlFor="customSwitch1">Kilowatts por hora</label>
                            </div>
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="customSwitch1" />
                                <label className="custom-control-label" htmlFor="customSwitch1">Pesos colombianos</label>
                            </div>
                            <div className="input-group mb-3 ">
                                <input type="number" className="form-control" name='unidad' placeholder="Unidad" />
                            </div>
                            <Button variant="primary" size="sm">
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
        tipoLimite: state.consumo.tipoLimite
    }
}

export default connect(mapStateToProps)(consumoReal);
