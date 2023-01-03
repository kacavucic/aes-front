import React, {useEffect} from "react";
import Intro from "../components/Intro";
import {useKeycloak} from "@react-keycloak/web";
import hero from "../assets/img/aes-img.svg";
import ds from "../assets/img/ds.png"

function HomePage({section, addSection}) {

    // Scrolling
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }


    useEffect(() => {
        const scrollto = (el) => {
            console.log("element home: " + el);
            let header = select('#header')
            let offset = header.offsetHeight

            let elementPos = select(el).offsetTop
            window.scrollTo({
                top: elementPos - offset,
                behavior: 'smooth'
            })
            addSection("");
        }
        console.log("primio sam section: " + section);
        if (section !== "") {
            scrollto(section);
        }

    }, []);

    const {keycloak, initialized} = useKeycloak();
    const url = keycloak.createLoginUrl();

    function handleLogin() {
        window.location.href = url;
    }

    return (
        <>
            <Intro/>
            <main
                id="main">
                <section id="about" className="about">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>About AES</h2>
                        </div>

                        <div className="row content">
                            <div className="col-lg-12">
                                <p>
                                    AES is an electronic signature
                                    solution that uses advanced electronic signature and allows users to manage the
                                    document signing process. It can also be integrated within other
                                    applications through the use of
                                    its API. AES handles user verification
                                    and incorporates necessary data into the signature in the document. advanced electronic signature is:
                                </p>
                                <ul>
                                    <li><i className="ri-check-double-line"/> Uniquely linked to the signatory
                                    </li>
                                    <li><i className="ri-check-double-line"/> Capable of identifying the signatory
                                    </li>
                                    <li><i className="ri-check-double-line"/>  Created using electronic signature creation data that the
                                        signatory can, with a high level of confidence, use under his sole control
                                    </li>
                                    <li><i className="ri-check-double-line"/>  Linked to the data
                                        signed therewith in such a way that any subsequent change in the data is detectable
                                    </li>
                                </ul>
                                <a href="https://ec.europa.eu/digital-building-blocks/wikis/display/ESIGKB/What+are+the+levels,+simple,+advanced+and+qualified+of+electronic+signatures"
                                   className="btn-learn-more float-end">Learn More</a>
                            </div>
                        </div>

                    </div>
                </section>
                <section id="services" className="services section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Document Signing process</h2>
                        </div>

                        <div className="row">
                            <div className="col-xl-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in"
                                 data-aos-delay="100">
                                <div className="icon-box">
                                    <div className="icon"><i className=""/></div>
                                    <h4><span style={{
                                        color: "#37517e",
                                        fontWeight: 600,
                                        fontSize: 24 + "px",
                                        paddingRight: 10 + "px"
                                    }}>1.</span><a href="/">Initiate Signing Session</a></h4>
                                    <h5><a href="/">Upload Document for Signing</a></h5>
                                    <p>Initiate the signing process by uploading the document you want to sign.</p>
                                </div>
                            </div>

                            <div className="col-xl-4 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
                                 data-aos="zoom-in" data-aos-delay="200">
                                <div className="icon-box">
                                    <div className="icon"><i className=""/></div>
                                    <h4><span style={{
                                        color: "#37517e",
                                        fontWeight: 600,
                                        fontSize: 24 + "px",
                                        paddingRight: 10 + "px"
                                    }}>2.</span><a href="/">Approve Signing</a></h4>
                                    <h5><a href="/">Review Document Before Signing</a></h5>
                                    <p>In order to start the signing
                                        process you must first scroll through the whole
                                        document and review its content before you give <i> AES </i> consent to
                                        sign document on your behalf.</p>
                                </div>
                            </div>

                            <div className="col-xl-4 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
                                 data-aos="zoom-in" data-aos-delay="300">
                                <div className="icon-box">
                                    <div className="icon"><i className=""/></div>
                                    <h4><span style={{
                                        color: "#37517e",
                                        fontWeight: 600,
                                        fontSize: 24 + "px",
                                        paddingRight: 10 + "px"
                                    }}>3.</span><a href="/">Sign Document</a></h4>
                                    <h5><a href="/">Sign And Download Document</a></h5>
                                    <p>An OTP has is sent to your email address. You must provide
                                        valid OTP in order to
                                        complete the document signing process. </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <section id="cta" className="cta">
                    <div className="container" data-aos="zoom-in">

                        <div className="row">
                            <div className="col-lg-12 text-center text-lg-start">
                                <h3>Security Measures</h3>
                                <p> In addition to being legally binding, electronic signatures have in-built security
                                    measures. AES’s electronic signatures:
                                    <br/><br/>
                                    <ul>
                                        <li>
                                            <b>Have bank-grade security</b>
                                            <br/>
                                            AES meets some of the most stringent
                                            EU security standards. Each eSignature is unique, documentable,
                                            encrypted, and
                                            tamper-evident. Multi-faceted verification of signing events is guaranteed
                                            to
                                            ensure that the signatory can sign documents knowing his data is secure.
                                        </li>
                                        <br/>
                                        <li>
                                            <b>Have an audit trail</b>
                                            <br/>
                                            AES provides a complete and extensive audit
                                            trail that serves as
                                            third-party validation of transaction completion, including information such
                                            as the
                                            signer's email address, name, authentication method, IP address, time-stamp,
                                            and
                                            more.
                                        </li>
                                    </ul>
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
                <section id="faq" className="faq section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Frequently Asked Questions</h2>
                        </div>

                        <div className="faq-list">
                            <ul>
                                <li data-aos="fade-up" data-aos-delay="100">
                                    <i className="bx bx-help-circle icon-help"/> <a data-bs-toggle="collapse"
                                                                                    className="collapse"
                                                                                    data-bs-target="#faq-list-1">What is
                                    an electronic signature? <i
                                        className="bx bx-chevron-down icon-show"/><i
                                        className="bx bx-chevron-up icon-close"/></a>
                                    <div id="faq-list-1" className="collapse show" data-bs-parent=".faq-list">
                                        <p>
                                            An electronic signature is a data in electronic form which is attached to or
                                            logically associated with other data in electronic form and which is used by
                                            the signatory to sign, where the signatory is a natural person.
                                            <br/><br/>
                                            Like its handwritten counterpart in the offline world, an electronic
                                            signature can be used, for instance, to electronically indicate that the
                                            signatory has written the document, agreed with the content of the document,
                                            or that the signatory was present as a witness.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="200">
                                    <i className="bx bx-help-circle icon-help"/> <a data-bs-toggle="collapse"
                                                                                    data-bs-target="#faq-list-2"
                                                                                    className="collapsed">What is the
                                    difference between an electronic signature and a digital signature?<i
                                        className="bx bx-chevron-down icon-show"/><i
                                        className="bx bx-chevron-up icon-close"/></a>
                                    <div id="faq-list-2" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            An <b style={{color: "#47b2e4"}}>electronic signature</b> is a legal concept
                                            that is defined by eIDAS
                                            as <i> data in electronic form which is
                                            attached to
                                            or logically associated with other data in electronic form and which is used
                                            by the signatory to sign </i> (eIDAS Article 3.10).
                                            <br/><br/>
                                            A <b style={{color: "#47b2e4"}}>digital signature</b>, on the other hand,
                                            refers to a mathematical and
                                            cryptographic concept that is widely used to provide concrete and practical
                                            instances of electronic signature. The definition given by ETSI TR 119 100
                                            is that of <i>data appended to, or a cryptographic transformation of a data
                                            unit that allows a recipient of the data unit to prove the source and
                                            integrity of the data unit and protect against forgery e.g. by the
                                            recipient.</i>
                                            <br/><br/>
                                            These two concepts should be distinguished, as all electronic signatures are
                                            not necessarily digital signatures.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="300">
                                    <i className="bx bx-help-circle icon-help"/> <a data-bs-toggle="collapse"
                                                                                    data-bs-target="#faq-list-3"
                                                                                    className="collapsed">What are the
                                    levels (simple, advanced and qualified) of electronic signatures?<i
                                        className="bx bx-chevron-down icon-show"/><i
                                        className="bx bx-chevron-up icon-close"/></a>
                                    <div id="faq-list-3" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            The eIDAS Regulation defines three levels of electronic signature: 'simple'
                                            electronic signature, advanced electronic signature and qualified electronic
                                            signature. The requirements of each level are built on the requirements of
                                            the level below it, such that a qualified electronic signature meets the
                                            most requirements and a 'simple' electronic signature the least.
                                            <br/><br/>
                                            <b style={{color: "#47b2e4"}}>'Simple' electronic signatures</b>
                                            <br/>
                                            An electronic signature is defined as "data in electronic form which is
                                            attached to or logically associated with other data in electronic form and
                                            which is used by the signatory to sign". Thus, something as simple as
                                            writing your name under an e-mail might constitute an electronic signature.
                                            <br/><br/>
                                            <b style={{color: "#47b2e4"}}>Advanced electronic signatures (AdES)</b>
                                            <br/>
                                            An advanced electronic signature is an electronic signature which is
                                            additionally:
                                            <br/><br/>
                                            <span style={{
                                                color: "#47b2e4",
                                                fontWeight: 1000,
                                                marginRight: 10 + "px",
                                                marginLeft: 10 + "px"
                                            }}>&#8226;</span>uniquely linked to and
                                            capable of identifying the signatory;<br/>
                                            <span style={{
                                                color: "#47b2e4",
                                                fontWeight: 1000,
                                                marginRight: 10 + "px",
                                                marginLeft: 10 + "px"
                                            }}>&#8226;</span>created in a way that allows
                                            the signatory to retain control;<br/>
                                            <span style={{
                                                color: "#47b2e4",
                                                fontWeight: 1000,
                                                marginRight: 10 + "px",
                                                marginLeft: 10 + "px"
                                            }}>&#8226;</span>linked to the document in a
                                            way that any subsequent change of the data is
                                            detectable.
                                            <br/><br/>
                                            The most commonly used technology able to provide these requirements relies
                                            on the use of a public-key infrastructure (PKI), which involves the use of
                                            certificates and cryptographic keys.
                                            <br/><br/>
                                            <b style={{color: "#47b2e4"}}> Qualified electronic signatures (QES)</b>
                                            <br/>
                                            A qualified electronic signature is an advanced electronic signature which
                                            is additionally:
                                            <br/><br/>
                                            <span style={{
                                                color: "#47b2e4",
                                                fontWeight: 1000,
                                                marginRight: 10 + "px",
                                                marginLeft: 10 + "px"
                                            }}>&#8226;</span>created by a qualified
                                            signature creation device (QSCD);<br/>
                                            <span style={{
                                                color: "#47b2e4",
                                                fontWeight: 1000,
                                                marginRight: 10 + "px",
                                                marginLeft: 10 + "px"
                                            }}>&#8226;</span>and is based on a qualified
                                            certificate for electronic signatures.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="400">
                                    <i className="bx bx-help-circle icon-help"/> <a data-bs-toggle="collapse"
                                                                                    data-bs-target="#faq-list-4"
                                                                                    className="collapsed"> What are the
                                    legal effects of an electronic signature?<i
                                        className="bx bx-chevron-down icon-show"/><i
                                        className="bx bx-chevron-up icon-close"/></a>
                                    <div id="faq-list-4" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Across all EU Member States, the legal effects of electronic signatures are
                                            laid down in Article 25 of eIDAS.
                                            <br/><br/>
                                            An electronic signature (either simple, advanced or qualified) shall not be
                                            denied legal effect and admissibility as evidence in legal proceedings
                                            solely on the grounds that it is in an electronic form or that it does not
                                            meet the requirements for qualified electronic signatures.
                                            <br/><br/>
                                            Regarding qualified electronic signatures, they explicitly have the
                                            equivalent legal effect of handwritten signatures across all EU Member
                                            States.
                                        </p>
                                    </div>
                                </li>

                                <li data-aos="fade-up" data-aos-delay="500">
                                    <i className="bx bx-help-circle icon-help"/> <a data-bs-toggle="collapse"
                                                                                    data-bs-target="#faq-list-5"
                                                                                    className="collapsed">What are
                                    electronic signatures used for? <i className="bx bx-chevron-down icon-show"/><i
                                        className="bx bx-chevron-up icon-close"/></a>
                                    <div id="faq-list-5" className="collapse" data-bs-parent=".faq-list">
                                        <p>
                                            Electronic signatures are used for many kinds of documents and transactions,
                                            both for <b style={{color: "#47b2e4"}}>personal</b> and <b
                                            style={{color: "#47b2e4"}}>business use</b>. Some examples include
                                            contracts and
                                            agreements, loans and leases, forms, orders, and more. Businesses in nearly
                                            every sector can benefit from using e-signatures and they are often used for
                                            financial services agreements, HR documents.,healthcare forms,
                                            non-disclosure agreements and government services. Many organisations
                                            implement electronic signatures because it offers several benefits including
                                            increased flexibility. It allows employees and customers to sign documents
                                            remotely, streamlines productivity, improves experiences and reduces risks.
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

