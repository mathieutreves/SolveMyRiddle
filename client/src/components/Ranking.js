import { Col, Form, Row } from "react-bootstrap";


const classPlaces = {
    '1' : 'first-place',
    '2' : 'second-place',
    '3' : 'third-place',
};

function RankingList(props) {
    return (
        <Form className="ranking-form border rounded">
            <Row>
                <h3>Ranking</h3>
                {
                    props.ranking.map((ranking) => 
                        <SingleRank ranking={ranking} key={ranking.email}/>
                    )
                }
            </Row>
        </Form>
    );
};

function SingleRank(props) {
    return (
        <Row className={classPlaces[props.ranking.rank]}>
            <Col md={11}>
                {props.ranking.username}
            </Col>
            <Col md={1}>
                {props.ranking.points}
            </Col>
        </Row>
    );
};

export { RankingList };