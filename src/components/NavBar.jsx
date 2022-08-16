import React, {useEffect, useState} from "react";
import {useCookies} from 'react-cookie';
import axios from "axios";

var qs = require('qs');

function NavBar({loggedIn,login,logout}) {

    return (
        <header id="header" className="fixed-top ">
            <div className="container d-flex align-items-center">

                <h1 className="logo me-auto"><a href="index.html">AES</a></h1>
                {/*<a href="index.html" class="logo me-auto"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>*/}

                <nav id="navbar" className="navbar">
                    <ul>
                        <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
                        <li><a className="nav-link scrollto" href="#about">About</a></li>
                        <li><a className="nav-link scrollto" href="#services">Services</a></li>
                        {/*<li className="dropdown"><a href="#"><span>Drop Down</span> <i*/}
                        {/*    className="bi bi-chevron-down"></i></a>*/}
                        {/*    <ul>*/}
                        {/*        <li><a href="#">Drop Down 1</a></li>*/}
                        {/*        <li className="dropdown"><a href="#"><span>Deep Drop Down</span> <i*/}
                        {/*            className="bi bi-chevron-right"></i></a>*/}
                        {/*            <ul>*/}
                        {/*                <li><a href="#">Deep Drop Down 1</a></li>*/}
                        {/*                <li><a href="#">Deep Drop Down 2</a></li>*/}
                        {/*                <li><a href="#">Deep Drop Down 3</a></li>*/}
                        {/*                <li><a href="#">Deep Drop Down 4</a></li>*/}
                        {/*                <li><a href="#">Deep Drop Down 5</a></li>*/}
                        {/*            </ul>*/}
                        {/*        </li>*/}
                        {/*        <li><a href="#">Drop Down 2</a></li>*/}
                        {/*        <li><a href="#">Drop Down 3</a></li>*/}
                        {/*        <li><a href="#">Drop Down 4</a></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        {loggedIn == false ? (
                            //TODO login btn on click resizes
                            <li><a className="getstarted scrollto" href="#" onClick={login}>Log In</a></li>
                        ) : (<li><a className="getstarted scrollto" href="#" onClick={logout}>Log Out</a></li>)}

                    </ul>
                    <i className="bi bi-list mobile-nav-toggle"></i>
                </nav>
            </div>
        </header>
    );
}

export default NavBar;
