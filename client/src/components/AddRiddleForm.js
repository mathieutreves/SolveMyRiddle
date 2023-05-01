import React, { useState } from 'react';
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { Riddle } from '../models/Riddle';

function AddRiddleForm (props) {

    const [validated, setValidated] = useState(false);
    
    const [text, setText] = useState('');
    const [answer, setAnswer] = useState('');
    const [hint1, setHint1] = useState('');
    const [hint2, setHint2] = useState('');
    const [difficulty, setDifficulty] = useState(1);
    const [duration, setDuration] = useState(300);

    // To be used when a riddle is added and we have to return to the main page
    const navigate = useNavigate();

    // On submit of the form, check the validity of all the fields, then create
    // a new riddle and call the function to add it to the server db, then
    // return home
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const rstatus = 1;
            const riddle = new Riddle({text, answer, hint1, hint2, difficulty, duration, rstatus});
            props.addRiddle(riddle);

            navigate('/');
        }
        setValidated(true);
    };

    return (
        <Form className='riddle-form border rounded' noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className='mb-4'>
                <Col md={8}>
                    <Form.Group controlId='questionInput'>
                        <Form.Label>Riddle</Form.Label>
                        <Form.Control 
                            required
                            as="textarea"
                            rows={5}
                            placeholder='Write here the riddle'
                            onChange={(e) => setText(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId='difficultyInput' className='mb-3'>
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Select required onChange={(e) => setDifficulty(e.target.value)}>
                            <option value='1'>Easy</option>
                            <option value='2'>Medium</option>
                            <option value='3'>Hard</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='timeInput'>
                        <Form.Label>Time</Form.Label>
                        <Form.Control 
                            required
                            type='text'
                            placeholder='Available time should be 30 - 600 [s]'
                            isInvalid={duration > 600 || duration < 30 || !Number.isInteger(duration)}
                            onChange={(e) => setDuration(Math.floor(e.target.value))}
                        />
                        <Form.Control.Feedback type="invalid">Set a valid time</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Form.Group controlId='answerInput'>
                    <Form.Label>Answer</Form.Label>
                    <Form.Control 
                        required
                        as="textarea"
                        rows={5}
                        placeholder='Write here the answer'
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </Form.Group>
            </Row>
            <Row className='mb-4'>
                <Form.Group controlId='hintsInput'>
                    <Form.Label>Hint 1</Form.Label>
                    <Form.Control 
                        className='mb-2'
                        required 
                        type='text' 
                        placeholder={`The first hint will be display after half of the time has passed ${duration ? '[' + duration * 0.5 + 's]' : ''}`}
                        onChange={(e) => setHint1(e.target.value)}
                    />
                    <Form.Label>Hint 2</Form.Label>
                    <Form.Control 
                        required 
                        type='text' 
                        placeholder={`The first hint will be display after 3/4 of the time has passed ${duration ? '[' + duration * 0.75 + 's]' : ''}`}
                        onChange={(e) => setHint2(e.target.value)}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Col md={12}>
                    <Link to='/'>
                        <Button className='mx-2' variant='outline-danger'>Cancel</Button>
                    </Link>
                    <Button className='mx-2' variant='outline-success' type='submit'>Submit Riddle</Button>
                </Col>
            </Row>
        </ Form>
    );
};

export { AddRiddleForm };