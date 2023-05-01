import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { LoginButton, LogoutButton } from './Authentication';

const MainNavbar = (props) => {
    return (
        <Navbar bg='dark' variant='dark' expand='sm' fixed='top' className='navbar-padding'>
            <Nav className='container-fluid'>
                <Nav.Item>
                    <NavLink to='/'>
                        <Navbar.Brand className='navbar-brand'>
                            <i className='bi bi-puzzle p-2 navbar-icon'/> Solve My Riddle
                        </Navbar.Brand>
                    </NavLink>
                    {
                        props.loggedIn
                        ? <>
                            <NavLink to='/type/openRiddles' className='navbar-item px-2'>Open</NavLink>
                            <NavLink to='/type/closedRiddles' className='navbar-item px-2'>Closed</NavLink>
                            <NavLink to='/type/myRiddles' className='navbar-item px-2'>My Riddles</NavLink>
                        </>
                        : <></>
                    }
                </Nav.Item>
            </Nav>
            <Nav>
                <Navbar.Text className='mx-3 text-white'>
                    {props.user && props.user.username && `User:\u00A0${props.user.username}`}
                </Navbar.Text>
                <Nav.Item className='mx-3'>
                    {
                        props.loggedIn
                        ? <LogoutButton logout={props.logout} />
                        : <Link to='/login'>
                            <LoginButton/>
                        </Link>
                    }
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export { MainNavbar };