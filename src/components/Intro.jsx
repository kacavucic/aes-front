import Modal from "react-modal";
import ReactPlayer from "react-player";
import hero from "../assets/img/hero-img.png";
import React, {useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {NavLink} from "react-router-dom";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById('root'));


function Intro() {

    // Keycloak
    const {keycloak, initialized} = useKeycloak();

    // Modal
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal(e) {
        e.preventDefault();
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = '#37517E';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const url = keycloak.createLoginUrl();

    function handleLogin() {
        window.location.href = url;
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <h1 ref={(_subtitle) => (subtitle = _subtitle)}>Document Signing</h1>
                <div className="modal-content">
                    <div className="modal-body mb-0 p-0">
                        <ReactPlayer
                            url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                            //  light='true'
                        >

                        </ReactPlayer>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <a href="/" className="twitter"><i className="bx bxl-twitter"/></a>
                        <a href="/" className="facebook"><i className="bx bxl-facebook"/></a>
                        <a href="/" className="instagram"><i className="bx bxl-instagram"/></a>
                        <a href="/" className="google-plus"><i className="bx bxl-skype"/></a>
                        <a href="/" className="linkedin"><i className="bx bxl-linkedin"/></a>

                    </div>
                </div>
            </Modal>

            <section id="hero" className="d-flex align-items-center">

                <div className="container">
                    <div className="row">
                        <div
                            className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
                            data-aos="fade-up" data-aos-delay="200">
                            <h1>Advanced Electronic Signature</h1>
                            <h2>Electronically signs PDF documents with an advanced electronic signature</h2>
                            <div className="d-flex justify-content-center justify-content-lg-start">


                                {!keycloak.authenticated && (
                                    <a role="button" className="btn-get-started" onClick={handleLogin}>
                                        Get Started</a>
                                )}

                                {!!keycloak.authenticated && (
                                    <NavLink to="/initiateSigningSession" className="btn-get-started">
                                        Upload</NavLink>
                                )}

                                <a role="button" className="glightbox btn-watch-video" onClick={openModal}>

                                    <i className="bi bi-play-circle"/>
                                    <span>Watch Demo</span>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
                            <img src={hero}
                                 className="img-fluid animated " alt=""/>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
}

export default Intro;
