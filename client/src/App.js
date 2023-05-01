import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import { Container, Toast, ToastContainer } from 'react-bootstrap/';

import { AppLayout, MainLayout, AddLayout, LoginLayout, NotFoundLayout } from './components/PageLayout';
import API from './API';
import MainContext from './contextMain';

const useHandleErrors = () => {
  const context = useContext(MainContext);

  return context.handleErrors;
};

function App() {

  const [message, setMessage] = useState('');
  const [ranking, setRanking] = useState([]);

  const handleErrors = (err) => {
    setMessage(err.error);
  };

  const changeRanking = (ranks) => {
    setRanking(ranks);
  };

  return (
    <BrowserRouter>
      <MainContext.Provider value={{ handleErrors, changeRanking }}>
        <Container>
          <Routes>
            <Route path = '/*' element = { <Main ranking={ranking}/> }></Route>
          </Routes>
          <ToastContainer position='bottom-center' className='text-white my-4 position-fixed'>
            <Toast show={message !== ''} bg='danger' onClose={() => setMessage('')} delay={4000} autohide>
              <Toast.Body>{ message }</Toast.Body>
            </Toast>
          </ToastContainer>
        </Container>
      </MainContext.Provider>
    </BrowserRouter>
  );
};

function Main(props) {

  // State for tracking if the user is logged in, default is false
  const [loggedIn, setLoggedIn] = useState(false);

  // State for tracking if the app is loading (when we are waiting), default is loading
  const [loading, setLoading] = useState(false);

  // State for keeping track of the users info, default is no user (null)
  const [user, setUser] = useState(null);

  const handleErrors = useHandleErrors();
  
  const navigate = useNavigate();

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        const user = await API.isUserLoggedIn();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        handleErrors(err);
        setUser(null);
        setLoggedIn(false);
      }
    };
    initApp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
      
      navigate('/'); // Navigate to the only page visible when not logged in
  };

  return (
    <>
      <Routes>
        <Route path = '/' element = {<AppLayout user={user} logout={handleLogout} loggedIn={loggedIn} ranking={props.ranking}/>}>
          <Route index element={<MainLayout loggedIn = {loggedIn} loading={loading} setLoading={setLoading} user={user}/>}/>
          <Route path='/type/:filter' element={<MainLayout loggedIn = {loggedIn} loading={loading} setLoading={setLoading} user={user}/>}/>
          <Route path='add' element={<AddLayout/>}/>
          <Route path = '*' element={<NotFoundLayout/>}/>
        </Route>
        <Route path = '/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginLayout login={handleLogin} loading={loading}/>}></Route>
      </Routes>
    </>
  );
};

export default App;
