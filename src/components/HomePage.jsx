import React, {useState} from "react";
import hero from '../assets/img/hero-img.png'
import Modal from 'react-modal';
import ReactPlayer from "react-player";

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

function HomePage({loggedIn, login}) {

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal(e) {
        e.preventDefault();
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#37517E';
    }

    function closeModal() {
        setIsOpen(false);
    }

    function upload() {

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
                        <a href="#" className="twitter"><i className="bx bxl-twitter"></i></a>
                        <a href="#" className="facebook"><i className="bx bxl-facebook"></i></a>
                        <a href="#" className="instagram"><i className="bx bxl-instagram"></i></a>
                        <a href="#" className="google-plus"><i className="bx bxl-skype"></i></a>
                        <a href="#" className="linkedin"><i className="bx bxl-linkedin"></i></a>

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
                                {loggedIn == false ? (
                                    <a href="#" className="btn-get-started scrollto" onClick={login}>
                                        Get Started</a>
                                ) : (<a href="#contact" className="btn-get-started scrollto">
                                    Upload</a>)}

                                <a href="#" className="glightbox btn-watch-video" onClick={openModal}>

                                    <i className="bi bi-play-circle"></i>
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

            <main id="main">

                <section id="cliens" className="cliens section-bg">
                    <div className="container">

                        <div className="row" data-aos="zoom-in">

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-1.png" className="img-fluid" alt=""/>
                            </div>

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-2.png" className="img-fluid" alt=""/>
                            </div>

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-3.png" className="img-fluid" alt=""/>
                            </div>

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-4.png" className="img-fluid" alt=""/>
                            </div>

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-5.png" className="img-fluid" alt=""/>
                            </div>

                            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
                                <img src="assets/img/clients/client-6.png" className="img-fluid" alt=""/>
                            </div>

                        </div>

                    </div>
                </section>


                <section id="about" className="about">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>About Us</h2>
                        </div>

                        <div className="row content">
                            <div className="col-lg-6">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore
                                    magna aliqua.
                                </p>
                                <ul>
                                    <li><i className="ri-check-double-line"></i> Ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat
                                    </li>
                                    <li><i className="ri-check-double-line"></i> Duis aute irure dolor in reprehenderit
                                        in voluptate velit
                                    </li>
                                    <li><i className="ri-check-double-line"></i> Ullamco laboris nisi ut aliquip ex ea
                                        commodo consequat
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-6 pt-4 pt-lg-0">
                                <p>
                                    Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                    reprehenderit in voluptate
                                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                                    non proident, sunt in
                                    culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <a href="#" className="btn-learn-more">Learn More</a>
                            </div>
                        </div>

                    </div>
                </section>


                <section id="services" className="services section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Services</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum
                                quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui
                                impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>

                        <div className="row">
                            <div className="col-xl-3 col-md-6 d-flex align-items-stretch" data-aos="zoom-in"
                                 data-aos-delay="100">
                                <div className="icon-box">
                                    <div className="icon"><i className="bx bxl-dribbble"></i></div>
                                    <h4><a href="">Lorem Ipsum</a></h4>
                                    <p>Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi</p>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
                                 data-aos="zoom-in" data-aos-delay="200">
                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-file"></i></div>
                                    <h4><a href="">Sed ut perspici</a></h4>
                                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
                                 data-aos="zoom-in" data-aos-delay="300">
                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-tachometer"></i></div>
                                    <h4><a href="">Magni Dolores</a></h4>
                                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</p>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
                                 data-aos="zoom-in" data-aos-delay="400">
                                <div className="icon-box">
                                    <div className="icon"><i className="bx bx-layer"></i></div>
                                    <h4><a href="">Nemo Enim</a></h4>
                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {loggedIn == false ? (
                    <section id="cta" className="cta">
                        <div className="container" data-aos="zoom-in">

                            <div className="row">
                                <div className="col-lg-9 text-center text-lg-start">
                                    <h3>Call To Action</h3>
                                    <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa
                                        qui officia deserunt mollit anim id est laborum.</p>
                                </div>
                                <div className="col-lg-3 cta-btn-container text-center">
                                    <a className="cta-btn align-middle" href="#">Call To Action</a>
                                </div>
                            </div>

                        </div>
                    </section>
                ) : (<section id="contact" className="contact">
                    <div className="container" data-aos="zoom-in">

                        <div className="row">
                            <div className="col-lg-6 text-center text-lg-start">
                                <h3>Upload Document for Signing</h3>
                                <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                                    qui officia deserunt mollit anim id est laborum.</p>
                            </div>
                            <div className="col-lg-6 cta-btn-container text-lg-start">
                                {/*<a className="cta-btn align-middle" href="#" onClick={upload}>Upload</a>*/}
                                {/*<div className="card-body">*/}
                                    <h3>Upload Document for Signing</h3>
                                    {/*<hr/>*/}
                                    <form encType="multipart/form-data" method="post" className="php-email-form">
                                        <div className="form-group">

                                                <div className="custom-file">
                                                    <input className="custom-file-input" id="document" name="document"
                                                           required type="file"/>
                                                    <label className="custom-file-label">Choose file...</label>
                                                </div>

                                        </div>
                                        <div className="text-center">
                                            <a className="contact-btn" type="submit">Upload</a>
                                        </div>
                                    </form>
                                {/*</div>*/}
                            </div>
                        </div>

                    </div>
                </section>)}


                <section id="faq" className="faq section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Frequently Asked Questions</h2>
                            <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum
                                quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui
                                impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p>
                        </div>

                        <div className="faq-list">
                            <ul>
                                <li data-aos="fade-up" data-aos-delay="100">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       className="collapse"
                                                                                       data-bs-target="#faq-list-1">Non
                                    consectetur a erat nam at lectus urna duis? <i
                                        className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-1" className="collapse show" data-bs-parent=".faq-list">
                                        <p>
                                            Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus
                                            laoreet non curabitur gravida. Venenatis lectus magna fringilla urna
                                            porttitor rhoncus dolor purus non.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="200">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-2"
                                                                                       className="collapsed">Feugiat
                                    scelerisque varius morbi enim nunc? <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-2" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id
                                            interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus
                                            scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper
                                            dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="300">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-3"
                                                                                       className="collapsed">Dolor sit
                                    amet consectetur adipiscing elit? <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-3" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci.
                                            Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet
                                            nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis
                                            convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio
                                            morbi quis
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="400">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-4"
                                                                                       className="collapsed">Tempus quam
                                    pellentesque nec nam aliquam sem et tortor consequat? <i
                                        className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-4" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim
                                            suspendisse in est ante in. Nunc vel risus commodo viverra maecenas
                                            accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis
                                            blandit turpis cursus in.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="500">
                                    <i className="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse"
                                                                                       data-bs-target="#faq-list-5"
                                                                                       className="collapsed">Tortor
                                    vitae purus faucibus ornare. Varius vel pharetra vel turpis nunc eget lorem
                                    dolor? <i className="bx bx-chevron-down icon-show"></i><i
                                        className="bx bx-chevron-up icon-close"></i></a>
                                    <div id="faq-list-5" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae
                                            ultricies leo integer malesuada nunc vel. Tincidunt eget nullam non nisi est
                                            sit amet. Turpis nunc eget lorem dolor sed. Ut venenatis tellus in metus
                                            vulputate eu scelerisque.
                                        </p>
                                    </div>
                                </li>

                            </ul>
                        </div>

                    </div>
                </section>
            </main>

        </>
    );
}

export default HomePage;

