import React, { useEffect, useState, useContext } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Container, Col, Row, Button } from 'react-bootstrap';

import { MainNavbar } from './Navbar';
import { RiddleList, RiddlePlaceholder } from './RiddleList';
import { LoginForm } from './Authentication';
import { AddRiddleForm } from './AddRiddleForm';
import { RankingList } from './Ranking';
import API from '../API';
import MainContext from '../contextMain';

import { useInterval } from '../hooks/useInterval';
import { Legend } from './Legend';
const API_POLLING_INTERVAL = 1000;

const useHandleErorrs = () => {
    const context = useContext(MainContext);
    return context.handleErrors;
};

const useChangeRanking = () => {
    const context = useContext(MainContext);
    return context.changeRanking;
};

// Layout to be displayed as the parent of all the other
// layouts
function AppLayout(props) {
    return (
        <Container fluid className='vh-100 main-container'>
            <MainNavbar user={props.user} login={props.login} logout={props.logout} loggedIn={props.loggedIn} manageFilter={props.manageFilter}/>
            <Row>
                <Col md={9} className='riddle-main '>
                    <Outlet/>
                </Col>
                <Col md={3}>
                    <RankingList ranking={props.ranking}/>
                    <Legend></Legend>
                </Col>
            </Row>
        </Container>
    );
};


// Layout to be displayed as the main layout
function MainLayout(props) {

    const [riddles, setRiddles] = useState([]);
    const [show, setShow] = useState(-1);

    const handleErrors = useHandleErorrs();
    const changeRanking = useChangeRanking();

    let { filter } = useParams();
    if (!filter) filter = '/all';
    else filter = '/' + filter;

    const chooseForm = (idx) => setShow(idx);
    
    useEffect(() => {
        props.setLoading(true);
        setShow(-1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loggedIn, filter]);
    
    // Polling every second the list of riddles and the user ranking
    useInterval(async () => {
        try {
            const newRanking = await API.getRanking();
            const listRiddles = await API.getListRiddles(filter);
            changeRanking(newRanking);
            setRiddles(listRiddles);
            props.setLoading(false);
        } catch (err) {
            handleErrors(err);
        }
    }, API_POLLING_INTERVAL);

    return (
        <>
            {
                props.loading 
                ? <LoadingLayout/>
                : <RiddleList loggedIn={props.loggedIn} riddles={riddles} user={props.user} show={show} chooseForm={chooseForm}></RiddleList>
            }
            {
                props.loggedIn
                ? <Link to='/add'>
                    <Button className='add-button'>Add Riddle</Button>
                  </Link>
                : <></>
            }
        </>
    );
};

// Layout to be displayed for adding a riddle
function AddLayout() {

    const handleErrors = useHandleErorrs();
    const addRiddle = async (riddle) => {
        try {
            await API.addRiddle(riddle);
        } catch (err) {
            handleErrors(err);
        }
    }

    return (
        <AddRiddleForm addRiddle={addRiddle}/>
    );
};

// Layout to be displayed when the user has to 
// login 
function LoginLayout(props) {

    return (
        <LoginForm login={props.login} loading={props.loading}/>
    );
};

// Layout to be displayed when the app is loading
// waiting from the server
function LoadingLayout() {

    return (
        <RiddlePlaceholder></RiddlePlaceholder>
    );
};

function NotFoundLayout() {
    
    return (
        <h1  className='vh-100 vw-100 justify-content-center'>Page Not Found</h1>
    );
};

export { AppLayout, MainLayout, AddLayout, LoginLayout, LoadingLayout , NotFoundLayout};