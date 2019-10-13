import React from 'react';
import { Row, Col } from 'react-bootstrap';

function HomeDefecto({ titulo }) {
    return (
        <div className="page-header">
            <div className="page-block">
                <Row className="align-items-center">
                    <Col md="" xl="" lg="" sm="">
                        <div className="page-header-title">
                            <h5 className="m-b-10">{titulo}</h5>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default HomeDefecto;
