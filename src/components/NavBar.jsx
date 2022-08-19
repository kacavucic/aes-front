import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";

var qs = require('qs');

function NavBar() {
    const {keycloak, initialized} = useKeycloak();

    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 100);
        });
    }, []);

    return (
        <>
            <header id="header" className={scroll ? "fixed-top  header-scrolled" : "fixed-top"}>
                <div className="container d-flex align-items-center">
                    <h1 className="logo me-auto"><a href="index.html">AES</a></h1>
                    <nav id="navbar" className="navbar">
                        <ul>
                            <li><a className="nav-link active" href="#hero">Home</a></li>
                            <li><a className="nav-link" href="#about">About</a></li>
                            <li><a className="nav-link" href="#services">Services</a></li>

                            {!keycloak.authenticated && (
                                //TODO login btn on click resizes
                                <li><a className="getstarted" href="#" onClick={keycloak.login}>Log In</a></li>
                            )}

                            {!!keycloak.authenticated && (
                                <li><a className="getstarted" href="#" onClick={keycloak.logout}>Log Out
                                    ({keycloak.tokenParsed.preferred_username}) </a></li>
                            )}





                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"></i>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default NavBar;
