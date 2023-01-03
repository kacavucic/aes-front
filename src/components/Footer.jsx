import React, {useEffect, useState} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

function Footer({addSection}) {

    // Scrolling
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 100);
        });
    }, []);

    const location = useLocation();
    let navigate = useNavigate();
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
    const {keycloak, initialized} = useKeycloak();
    const url = keycloak.createLoginUrl();

    function handleLogin() {
        window.location.href = url;
    }

    return (
        <>
            <footer id="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">

                            <div className="col-lg-3 col-md-6 footer-contact">
                                <h3>AES</h3>
                                <p>
                                    Jove Ilića 154<br/>
                                    Voždovac, Belgrade<br/>
                                    Serbia<br/><br/>
                                    <strong>Phone:</strong> +381 693724133<br/>
                                    <strong>Email:</strong> vucic.kat@gmail.com<br/>
                                </p>
                            </div>

                            <div className="col-lg-3 col-md-6 footer-links">
                                <h4>Useful Links</h4>
                                <ul>
                                    <li><i className="bx bx-chevron-right"/> <a role="button"
                                                                                onClick={() => scrollto("#about")}>About
                                        Us</a></li>
                                    <li><i className="bx bx-chevron-right"/> <a role="button"
                                                                                onClick={() => scrollto("#services")}>Security
                                        Measures</a>
                                    </li>
                                    <li><i className="bx bx-chevron-right"/> <a role="button"
                                                                                onClick={() => scrollto("#cta")}>Upload</a>
                                    </li>
                                    <li><i className="bx bx-chevron-right"/> <a role="button"
                                                                                onClick={() => scrollto("#faq")}>FAQ</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-3 col-md-6 footer-links">
                                <h4>Navigation</h4>
                                <ul>
                                    <li><i className="bx bx-chevron-right"/> <NavLink
                                        to="/initiateSigningSession">Upload</NavLink></li>
                                    {!keycloak.authenticated && (
                                        //TODO login btn on click resizes
                                        <li><i className="bx bx-chevron-right"/><a role='button' className="getstarted"
                                                                                   onClick={handleLogin}>Log
                                            In</a></li>
                                    )}

                                    {!!keycloak.authenticated && (
                                        <>
                                            <li><i className="bx bx-chevron-right"/><NavLink to="/signingSessions">Signing
                                                Sessions</NavLink>
                                            </li>
                                            <li><i className="bx bx-chevron-right"/><a role="button"
                                                                                       className="getstarted"
                                                                                       onClick={keycloak.accountManagement}>Profile</a>
                                            </li>
                                            <li><i className="bx bx-chevron-right"/><a role="button"
                                                                                       className="getstarted"
                                                                                       onClick={keycloak.logout}>Log Out
                                                ({keycloak.tokenParsed.preferred_username}) </a></li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            <div className="col-lg-3 col-md-6 footer-links">
                                <h4>Social Networks</h4>
                                <div className="social-links mt-3">
                                    <a href="/" className="twitter"><i className="bx bxl-twitter"/></a>
                                    <a href="/" className="facebook"><i className="bx bxl-facebook"/></a>
                                    <a href="/" className="instagram"><i className="bx bxl-instagram"/></a>
                                    <a href="/" className="google-plus"><i className="bx bxl-skype"/></a>
                                    <a href="https://www.linkedin.com/in/katarinavucic/" className="linkedin"><i
                                        className="bx bxl-linkedin"/></a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container footer-bottom clearfix">
                    <div className="copyright">
                        &copy; Copyright <strong><span>AES</span></strong>. All Rights Reserved
                    </div>
                </div>
            </footer>

            <a role="button" className={scroll ? "back-to-top d-flex align-items-center justify-content-center active" :
                "back-to-top d-flex align-items-center justify-content-center"}
               onClick={() => window.scrollTo(0, 0)}><i
                className="bi bi-arrow-up-short"/></a>
        </>
    );
}

export default Footer;
