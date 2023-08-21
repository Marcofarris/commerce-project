import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
//import Button from "react-bootstrap/Button";
import './Layout.css';

import { Button, ButtonGroup } from '@chakra-ui/react'

const Layout = () => {
  const [token, setToken] = useContext(UserContext);
  const URL = "http://localhost:8000/api";

  const logout = () => {
    fetch(`${URL}/logout`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer ' + token
          },
        }
      ).then(() =>  {
        sessionStorage.clear();
        window.location.reload();
      }
        );
    }
  
  // Render btn logout
  const renderBtnLog = () => {
    if (!window.sessionStorage.getItem("token")) {
      return (
        <Link to="/login" className="btn btn-primary">Login</Link>
      );
    } else {
      return <Button onClick={logout} className="btn btn-dark m-1">Logout</Button>
    }
  };

  const renderBtnOrders = ()=>{
    if (window.sessionStorage.getItem("role") == "Admin") {
      return (
        <Link to="/orders" className="btn btn-primary">Ordini</Link>
      );
    } else {
      return null
    }
  }



  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Link to="/commerce" className="btn btn-dark">Commerce</Link>
          <Link to="/charts" className="btn btn-info m-2">Charts</Link>
          <Link to="/email" className="btn btn-info m-2">Email</Link>
          {renderBtnOrders()}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            {renderBtnLog()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet context={[token, setToken]} />
    </>
  )
};

//  <Outlet context={[token, setToken]} />

export default Layout;