import React, { useState, useContext } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap/'
import API from '../API';
import { Answer } from '../models/Answer';
import { useInterval } from '../hooks/useInterval';
import { ShowTimer } from './ShowTimer';

import ContentLoader from "react-content-loader"
import ReactLoading from 'react-loading';
import MainContext from '../contextMain';

const API_POLLING_INTERVAL = 1000;

const riddleClassName = {
    '0' : 'riddle-form border rounded riddle-closed',
    '1' : 'riddle-form border rounded riddle-open'
};

const answerClassName = {
    '0' : 'm-2 p-1 border answer-wrong',
    '1' : 'm-2 p-1 border answer-correct'
};

const useHandleErorrs = () => {
    const context = useContext(MainContext);
    return context.handleErrors;
};

function RiddleList(props) {

    return (
        <>
            {
                props.riddles.map((riddle) => 
                    <RiddleForm riddle={riddle}
                                key={riddle.id}
                                show={props.show}
                                choose={props.chooseForm}
                                loggedIn={props.loggedIn}
                                user={props.user}
                                timer={props.timer}
                                setTimer={props.setTimer}/>
                )
            }
        </>
    );
};

function RiddleForm(props) {

    const [answers, setAnswers] = useState([]);
    const [answer, setAnswer] = useState('');
    const [update, setUpdate] = useState(false);
    const [hint, setHint] = useState(0);
    const [canAnswer, setCanAnswer] = useState(true);

    const handleErrors = useHandleErorrs();
    const showHints = (num) => { setHint(num); }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const riddleid = props.riddle.id;
            const userid = props.user.id;
            const answerToSend = new Answer({riddleid, userid, answer});
    
            await API.addAnswer(answerToSend);

            props.choose(-1);
            setCanAnswer(false);
        } catch (err) {
            handleErrors(err);
        }
    };

    // Polling every one second the riddle answers if we are in the visualization of one of 
    // our riddles. Otherwise, fetch the list of answers only one time
    useInterval(async () => {
        try {
            const answers = await API.getAnswers(props.riddle.id);
            setAnswers(answers);
        } catch (err) {
            handleErrors(err);
        }

        if (!(props.user?.id === props.riddle.user))
            setUpdate(false);
            
    }, update ? API_POLLING_INTERVAL : null);

    return (
        <Form className={riddleClassName[props.riddle.rstatus]} onSubmit={handleSubmit}>
            <Row>
                <Col md={10}>
                    <Form.Label className='riddle-form-title'>
                        {props.riddle.text}
                    </Form.Label>
                </Col>
                <Col md={2} className='pt-2 d-flex justify-content-end'>
                        {
                            (props.riddle.difficulty === 3)
                            ? <>
                                <i className="bi bi-asterisk icon-red"></i>
                                <i className="bi bi-asterisk icon-red"></i>
                                <i className="bi bi-asterisk icon-red"></i>
                              </>
                            : (props.riddle.difficulty === 2) 
                                ? <>
                                    <i className="bi bi-asterisk icon-orange"></i>
                                    <i className="bi bi-asterisk icon-orange"></i>
                                  </>
                                : <>
                                    <i className="bi bi-asterisk icon-green"></i>
                                  </>
                        }
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col md={8}>
                    {
                        props.show === props.riddle.id
                        ? (!props.riddle.rstatus || props.user?.id === props.riddle.user)
                            ? <>
                                <Row>
                                    <Col>
                                        {
                                            answers.length !== 0
                                            ? <RiddleAnswerList answers={answers}/>
                                            : <ReactLoading type={'bubbles'} color='#000' />
                                        }
                                    </Col>
                                </Row>
                                {
                                    props.riddle.rstatus 
                                    ? <></>
                                    : <Row>
                                        <Form.Label className='d-flex justify-content-end align-items-end mt-4 riddle-form-title text-success'>
                                            [{props.riddle.answer}]
                                        </Form.Label>
                                    </Row> 
                                }
                            </>
                            : <>
                                <Col>
                                {(hint === 1 || hint === 2) && 
                                <>
                                    <i className="bi bi-lightbulb icon-orange"></i>
                                    <Form.Label className='m-2 p-2 border hint'>{props.riddle.hint1}</Form.Label>
                                </>}
                                {(hint === 2) && 
                                <>
                                    <i className="bi bi-lightbulb icon-orange"></i>
                                    <Form.Label className='m-2 p-2 border hint'>{props.riddle.hint2}</Form.Label>
                                </>}
                                </Col>
                                <Form.Group>
                                    <Form.Label>Answer</Form.Label>
                                    <Form.Control as='textarea' rows={3} onChange={(e) => setAnswer(e.target.value)}/>
                                </Form.Group>
                                <Button className='mt-2 mx-2' variant='outline-danger' onClick={() => {props.choose(-1);}}>
                                    Hide
                                </Button>
                                <Button className='mt-2 mx-2' variant='outline-primary' type='submit'>
                                    Submit
                                </Button>
                            </>
                        : props.loggedIn
                            ? (!props.riddle.rstatus || props.user?.id === props.riddle.user)
                                ? <Button variant='outline-success' onClick={() => {props.choose(props.riddle.id); setUpdate(true);}}>
                                    View Answers
                                </Button>
                                : (canAnswer && props.riddle.useranswer === null)
                                    ? <Button variant='outline-success' onClick={() => {props.choose(props.riddle.id); setUpdate(false);}}>
                                        Try answering
                                    </Button>
                                    : <Form.Label>You have halready answered this riddle</Form.Label>
                            : <></>
                    }
                </Col>
                <Col md={4} className='d-flex justify-content-end align-items-end'>
                    {
                        props.riddle.rstatus
                        ? <>
                            <ShowTimer riddle={props.riddle} showHints={showHints}></ShowTimer>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <i className="bi bi-unlock-fill icon-green py-2"></i>
                        </>
                        : <i className="bi bi-lock-fill icon-red py-2"></i>
                    }
                </Col>
            </Row>
        </Form>
    );
};

function RiddleAnswerList(props) {
    return (
        <>
            {
                props.answers.map((answer) => 
                    <RiddleAnswer answer={answer} key={answer.answer}/>
                )
            }
        </>
    );
};

function RiddleAnswer(props) {

    return (
        <Row className={answerClassName[props.answer.correct]}>
            <Col md={8}className='d-flex pt-1 align-items-center'>
                <Form.Label>{props.answer.answer}</Form.Label>
            </Col>
            <Col md={4} className='d-flex justify-content-end align-items-center'>
                <Form.Text>{props.answer.user}</Form.Text>
                &nbsp;&nbsp;&nbsp;
                {props.answer.correct ? <i className="bi bi-award-fill icon-orange"></i> : <></>}
            </Col>
        </Row>
    );

};

function MyLoader () {
    return (
        <ContentLoader 
          speed={2}
          width="95%"
          height={250}
          viewBox="0 0 1000 250"
          backgroundColor="#d3d3d3"
          foregroundColor="#f5f5f5"
        >
          <rect x="2rem" y="2rem" rx="15" ry="15" width="95%" height="12rem" />
        </ContentLoader>
    );
};

function RiddlePlaceholder() {
    return (
        <>
            <MyLoader></MyLoader><br />
            <MyLoader></MyLoader><br />
            <MyLoader></MyLoader>
        </>
    );
};

export { RiddleList, RiddlePlaceholder };