import React, { Component } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
class Historial extends Component {
    render() {
        return (

            <Row>
                <Col lg={10}>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                <h5>Mi Historial</h5>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Mes</th>
                                        <th scope="col">Kwh</th>
                                        <th scope="col">$</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {obj.map((mes, id) =>
                                    <tr key={id}>
                                        <td>{this.nombreMes(+mes.mes)}</td>
                                        <td>{mes.consumoTotal}</td>
                                        <td>{mes.consumoCosto}</td>
                                        <td>
                                            <button value={mes.mes} onClick={this.consultarHistorial}> hola </button>
                                        </td>
                                    </tr>
                                )} */}
                                </tbody>
                            </table>

                        </Card.Body>

                    </Card>
                </Col>
                <Col lg={2}>
                </Col>
            </Row>

        )
    }
}

export default Historial
