import React from 'react';
import './ConsumoReal.css';
import { Row, Col } from 'react-bootstrap';

function BarraEstado({porcentajeLimite, valorActual, limite, inicio, unidadBarra, tema, altura}) {

    let temaBarra = tema ? tema : "progress-bar-striped";
    let alturaBarra = altura ? altura : 16;

    return (
        <Row className="">
            <Col lg={12}>
                <div className="progress m-t-30" style={{ height:  alturaBarra+"px" }}>
                    <div className={"progress-bar "+temaBarra} role="progressbar" style={{ width: porcentajeLimite + "%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" >
                        <span className="barraTitulo" style={{textAlign: "right"}}>{valorActual+" "+unidadBarra}</span>
                    </div>
                </div>
            </Col>
            <Col lg={12}>
                <Row>
                    <Col className="barraTitulo" style={{textAlign: "letf"}} lg={6}><span >{inicio}</span></Col>
                    <Col className="barraTitulo" style={{textAlign: "right"}} lg={6}><span >{limite}</span></Col>
                </Row>
            </Col>
            <Col lg={12}> 
                <div className="circulo textoConsumo shadow-2 mx-auto mt-3" style={{ textAlign: 'center' }}>{porcentajeLimite + "%"}</div>
            </Col>
        </Row>
    )
}

export default BarraEstado;