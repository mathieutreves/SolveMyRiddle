import { useState } from 'react';

import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import ReactLoading from 'react-loading';

function LoginForm(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState({});
    const [show, setShow] = useState(false);

    // On submit, try to login
    const handleSubmit = (event) => {
        event.preventDefault();

        const credentials = {username, password};
        setLoading(true);
        props.login(credentials)
            .then(setLoading(false))
            .catch((err) => {
                setErrorMsg(err.error);
                setShow(true);
            });
    };

    return (
        <Row className='vh-100 vw-100 justify-content-center'>
            <Col md={4} className='col-2'>
                <Form className='login-form border p-5 rounded' onSubmit={handleSubmit}>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant='danger'>
                        {errorMsg}
                    </Alert>
                    <h1 className='text-center'>Login</h1>
                    <Form.Group className='mb-2' controlId='username'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type='email'
                            value={username}
                            placeholder='Enter email'
                            onChange={(ev) => setUsername(ev.target.value)}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group className='mb-2'  controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            value={password}
                            placeholder='Enter password'
                            onChange={(ev) => setPassword(ev.target.value)}
                            required={true}
                            minlenght={8}
                            />
                    </Form.Group>
                    { /** If we try to login, show bubbles */
                        loading
                        ? <Row className='justify-content-center'>
                            <Col md={2}>
                                <ReactLoading type={'bubbles'} color='#000' />
                            </Col>
                        </Row>
                        : <Row className='justify-content-center'>
                            <Col md={2}>
                                <Button className='mt-3' type='submit'>Login</Button>
                            </Col>
                        </Row>
                     }
                </Form>
            </Col>
        </Row>
    );
};

function LoginButton(props) {
    return(
        <Button variant='outline-success'>Login</Button>
    );
};

function LogoutButton(props) {
    return(
        <Button variant='outline-danger' onClick={props.logout}>Logout</Button>
    );
};

export { LoginForm, LoginButton, LogoutButton };