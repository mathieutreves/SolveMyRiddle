import { Col, Form, Row } from "react-bootstrap";

function Legend () {
    return (
        <Form className="legend-form border rounded">
            <Row>
                <h3>Legend</h3>
                <Col md={8}>
                    <Form.Label>Difficult</Form.Label>
                </Col>
                <Col md={4} className='d-flex justify-content-end'>
                    <i className="bi bi-asterisk icon-red"></i>
                    <i className="bi bi-asterisk icon-red"></i>
                    <i className="bi bi-asterisk icon-red"></i>
                </Col>
                <Col md={8}>
                    <Form.Label>Medium</Form.Label>
                </Col>
                <Col md={4} className='d-flex justify-content-end'>
                    <i className="bi bi-asterisk icon-orange"></i>
                    <i className="bi bi-asterisk icon-orange"></i>
                </Col>
                <Col md={8}>
                    <Form.Label>Easy</Form.Label>
                </Col>
                <Col md={4} className='d-flex justify-content-end'>
                    <i className="bi bi-asterisk icon-green"></i>
                </Col>
            </Row>
        </Form>
    );
};

export { Legend };