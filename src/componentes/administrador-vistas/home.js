//Componente
import React, { Component } from 'react';
import { connect } from 'react-redux';

import CardComponent from '../card/card';

import { Row, Col } from 'react-bootstrap';

export class Home extends Component {
    render() {
        return (
            <Row className="">
                <Col md={6} xl={3} lg={4} sm={12}>
                    <CardComponent />
                </Col>
                <Col md={6} xl={3} lg={4} sm={12}>
                    <CardComponent />
                </Col>
                <Col md={6} xl={3} lg={4} sm={12}>
                    <CardComponent />
                </Col>
                <Col md={6} xl={3} lg={4} sm={12}>
                    <CardComponent />
                </Col>
            </Row>
        )
    }
}

export default connect(null, null)(Home);