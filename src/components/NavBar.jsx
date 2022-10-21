import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {NavLink, useLocation, useNavigate} from "react-router-dom";

function NavBar({addSection}) {

    // Keycloak
    const {keycloak, initialized} = useKeycloak();

    // Navigation
    const location = useLocation();
    let navigate = useNavigate();
    const [isHome, setIsHome] = useState(false);

    // Scrolling
    const [scroll, setScroll] = useState(false);
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }
    const scrollto = (el) => {
        if (location.pathname !== "/") {
            addSection(el);
            navigate("/");
            return;
        }
        console.log("element: " + el);
        let header = select('#header')
        let offset = header.offsetHeight

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })

    }

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 100);
        });

        const currentPath = location.pathname;
        // console.log(currentPath);
        if (currentPath === "/") {
            setIsHome(true);
        } else {
            setIsHome(false);
        }

        console.log(keycloak.token);

    }, [location]);

    const url = keycloak.createLoginUrl();

    function handleLogin() {
        window.location.href = url;
    }

    // function profile() {
    //     keycloak.loadUserProfile()
    //         .then(function (profile) {
    //             alert(JSON.stringify(profile, null, "  "))
    //         }).catch(function () {
    //         alert('Failed to load user profile');
    //     });
    // }

    return (
        <>
            <header id="header"
                    className={isHome ? (scroll ? "fixed-top  header-scrolled" : "fixed-top") : "fixed-top header-inner-pages"}>
                <div className="container d-flex align-items-center">
                    <h1 className="logo me-auto"><a href="/">AES</a></h1>
                    <nav id="navbar" className="navbar">
                        <ul>
                            <li className="dropdown">
                                <NavLink to="/" onClick={() => scrollto("#hero")}>
                                    <span>Home</span>
                                    <i className="bi bi-chevron-down"/>
                                </NavLink>
                                <ul>
                                    <li>
                                        <a role="button" onClick={() => scrollto("#about")}>About Us</a>
                                    </li>
                                    <li><a role="button" onClick={() => scrollto("#services")}>Services</a></li>
                                    <li><a role="button" onClick={() => scrollto("#cta")}>Call To Action</a></li>
                                    <li><a role="button" onClick={() => scrollto("#faq")}>FAQ</a></li>
                                </ul>
                            </li>
                            <li><NavLink to="/initiateSigningSession">Upload</NavLink></li>

                            {!keycloak.authenticated && (
                                //TODO login btn on click resizes
                                <li><a role='button' className="getstarted" onClick={handleLogin}>Log
                                    In</a></li>
                            )}

                            {!!keycloak.authenticated && (
                                <>
                                    <li><a role="button" className="getstarted" onClick={keycloak.accountManagement}>Profile</a>
                                    </li>
                                    <li><NavLink to="/signingSessions">Signing Sessions</NavLink>
                                    </li>
                                    <li><a role="button" className="getstarted" onClick={keycloak.logout}>Log Out
                                        ({keycloak.tokenParsed.preferred_username}) </a></li>
                                </>
                            )}


                        </ul>
                        <i className="bi bi-list mobile-nav-toggle"/>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default NavBar;
