import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Cargando from '../../cargando/cargando';
import '../cliente/HistorialAlertas.css';

class HistorialAlertas extends Component {

    render() {
        const { alerta, consultaAlerta } = this.props;
        let AlertasArray = [];

        if (consultaAlerta === false) {
            return <Cargando />
        }

        if (!alerta || (alerta && !alerta.historico) || (alerta && alerta.historico && alerta.historico.length === 0)) {
            return <div>No hay historial</div>
        }else{
            for (let index = 0; index < alerta.historico.length; index++) {
                const element = alerta.historico[index];
                AlertasArray.unshift(element);
            }
        }

        return (

            <Card>
                <Card.Header id="historialTitulo" className="textoHistorial">

                    Mis notificaciones
                    <i id="alertaIcono" className="feather icon-alert-circle ml-1" />

                </Card.Header>
                <Card.Body className="container">
                    <Row>
                        {AlertasArray.map((notificacion, index) =>
                            <Col lg={12} key={index}>
                                <Card>
                                    <Card.Body>
                                        mensaje: {notificacion.mensaje}
                                        <div className="mt-1" style={{fontSize: "11px"}}>
                                            fecha de emisión: {notificacion.fecha}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Card.Body>

            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        alerta: state.consumo.alerta,
        consultaAlerta: state.consumo.consultaAlerta
    }
}

export default connect(mapStateToProps)(HistorialAlertas);