import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {Document, Page} from "react-pdf/dist/umd/entry.webpack";
import {useLocation, useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Checkbox} from "primereact/checkbox";
import LoadingSpinner from "../components/LoadingSpinner";
import {Dialog} from "primereact/dialog";
import {Steps} from "primereact/steps";
import {Chip} from "primereact/chip";


function ApproveSigningPage({signingSessionId, addSection}) {

    const {keycloak, initialized} = useKeycloak();
    const [errors, setErrors] = useState(null);
    const [doc, setDoc] = useState(null);
    const toast = useRef(null);
    const scrollRef = useRef(null);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [renderedPageNumber, setRenderedPageNumber] = useState(null);

    const isLoading = renderedPageNumber !== pageNumber;

    const [hasRead, setHasRead] = useState(false);
    const [checked, setChecked] = useState(false);

    const [showDialog, setShowDialog] = useState(false);

    let navigate = useNavigate();
    const [signingSession, setSigningSession] = useState({
        signingSession: false,
        documentName: null,
        status: null
    });

    useEffect(() => {
        getSigningSession();
    }, []);

    function getSigningSession() {

        var config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId,
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setSigningSession({
                    documentName: response.data.documentName,
                    status: response.data.status,
                    signingSession: true
                })
                showDocument(response.data.id);
            })
            .catch(function (error) {
                if (error.response) {
                    setErrors(error.response.data.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(error.response.data));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    setErrors(error.request);
                    // The client never received a response, and the request never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });

    }

    function showDocument(id) {
        let config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + id + '/document',

            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };
        axios(config)
            .then(function (response) {
                setErrors(null);
                setDoc(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    let arrayBufferConverted = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(error.response.data)));
                    setErrors(arrayBufferConverted.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(arrayBufferConverted));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    setErrors(error.request);
                    // The client never received a response, and the request never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
        if (numPages === 1) {
            setHasRead(true);
        }
    }

    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function scrollToTop() {
        setTimeout(function () {
            var headerOffset = 72.5;
            var elementPosition = scrollRef.current.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, 1);
    }

    function previousPage() {
        changePage(-1);
        scrollToTop();
    }

    function nextPage() {
        changePage(1);
        if (pageNumber === (numPages - 1)) {
            setHasRead(true);
        }
        scrollToTop();
    }

    function approveSigning() {
        var data = JSON.stringify({
            "consent": checked
        });

        var config = {
            method: 'put',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/approve',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                navigate("/sign");
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                if (error.response) {
                    setErrors(error.response.data.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(error.response.data));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    setErrors(error.request);
                    // The client never received a response, and the request never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    function cancelSigningSession() {
        var config = {
            method: 'put',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/cancel',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                console.log(JSON.stringify(response.data));
                setShowDialog(true);
            })
            .catch(function (error) {
                if (error.response) {
                    setErrors(error.response.data.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(error.response.data));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    setErrors(error.request);
                    // The client never received a response, and the request never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    const getErrorView = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: <p style={{color: "#ff5757"}}>{errors}</p>,
            life: 10000
        });
        setErrors(null);
    }

    function renderFooter() {
        return (
            <div>
                <Button label="Upload" className="p-button-rounded p-button-secondary p-button-sm"
                        onClick={navigateToInitiateSigningSessionsPage}/>
                <Button label="Signing Sessions" className="p-button-rounded p-button-secondary p-button-sm"
                        onClick={navigateToSigningSessionsPage}/>
            </div>
        );
    }

    function navigateToInitiateSigningSessionsPage() {
        navigate("/initiateSigningSession")
    }

    function navigateToSigningSessionsPage() {
        navigate("/signingSessions")
    }

    function navigateToApproveSigningPage() {
        navigate("/approveSigning")
    }

    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }
    const location = useLocation();
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

    function onHide() {
        scrollto("#hero");
    }

    const items = [
        {
            label: 'Initiate Signing Session',
            command: () => {
                navigateToInitiateSigningSessionsPage();
            }
        },
        {
            label: 'Approve Signing',
            command: () => {
                navigateToApproveSigningPage();
            }
        },
        {
            label: 'Sign Document',
            disabled: true
        }
    ];


    return (
        <>
            {errors ? getErrorView() : <></>}
            <Toast ref={toast}/>
            <Dialog className="dialog-demo" header="Canceled" visible={showDialog}
                    style={{width: '50vw'}} footer={renderFooter} onHide={onHide}>
                <p>You have successfully canceled signing session for document <b>{signingSession.documentName}</b>. You
                    can upload a new document for signing or
                    continue the signing process for this
                    document anytime on <i> Signing Sessions</i> page.</p>
            </Dialog>

            <main id="main">
                <section id="breadcrumbs" className="breadcrumbs">
                    <div id="steps" className="container">
                        <Steps model={items} activeIndex={1}
                               readOnly={false}/>
                    </div>
                </section>
                <section className="inner-page">
                    <section id="contact" className="contact">
                        <div className="container" data-aos="zoom-in">
                            <div className="row">
                                <div className="col text-center text-lg-start">
                                    <div className="row">
                                        <div className="col">
                                            <h3>Review Document Before Signing</h3>

                                        </div>
                                        <div className="col text-end">
                                            {signingSession.signingSession ? <Chip label={signingSession.documentName}
                                                                                   icon="pi pi-file-pdf"
                                                                                   className="mr-2 mb-2"/> : <></>}

                                        </div>
                                    </div>

                                    <p className="file-form">
                                        Previously uploaded document is displayed in the WYSIWYS (<i>What You See Is
                                        What
                                        You Sign)</i> interface. You must be able to view the document clearly
                                        in the WYSIWYS web
                                        user interface to accomplish the signing process. You can
                                        click <i>Cancel</i> button at any time before signing is completed
                                        to decline
                                        to sign the document as <i> AES </i> is focused on capturing the
                                        intent of the signatory to sign a document.
                                        In order to start the signing process you must first scroll through the whole
                                        document and review its content before WYSIWYS activates a
                                        checkbox which you should
                                        tick in order to give the consent for document signing. By clicking the <i>Approve
                                        Signing</i> button you give <i> AES </i> consent to
                                        sign document on your behalf.
                                    </p>
                                    {doc ? <>
                                            <div className="react-component">
                                                <Document
                                                    file={doc}
                                                    onLoadSuccess={onDocumentLoadSuccess}
                                                    renderMode={"svg"}
                                                    loading={LoadingSpinner}
                                                    inputRef={scrollRef}>
                                                    {isLoading && renderedPageNumber ? (
                                                        <Page
                                                            key={renderedPageNumber}
                                                            className={"rendering"}
                                                            pageNumber={renderedPageNumber}
                                                            width={816}
                                                            style={{position: "relative"}}/>
                                                    ) : null}
                                                    <Page
                                                        className={isLoading ? "departuring" : "rendered"}
                                                        key={pageNumber}
                                                        pageNumber={pageNumber}
                                                        onRenderSuccess={() => setRenderedPageNumber(pageNumber)}
                                                        width={816}
                                                        style={{position: "relative"}}/>
                                                    <div className="page-controls">
                                                        <button type="button" disabled={pageNumber <= 1}
                                                                onClick={previousPage}>‹
                                                        </button>
                                                        <span>Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}</span>
                                                        <button type="button" disabled={pageNumber >= numPages}
                                                                onClick={nextPage}>›
                                                        </button>
                                                    </div>
                                                </Document>
                                            </div>
                                            <div className="container-fluid" style={{maxWidth: 816 + "px"}}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row field-checkbox">
                                                            <div className="col-auto">
                                                                <Checkbox inputId="binary" checked={checked}
                                                                          disabled={!hasRead}
                                                                          onChange={e => setChecked(e.checked)}/>
                                                            </div>
                                                            <div className="col-md-11">
                                                                <label className="form-check-label"
                                                                       style={hasRead ? {
                                                                           color: "white",
                                                                           textAlign: "justify",
                                                                           fontSize: 17 + "px"
                                                                       } : {
                                                                           color: "grey",
                                                                           textAlign: "justify",
                                                                           fontSize: 17 + "px"
                                                                       }}
                                                                       htmlFor="binary">I
                                                                    declare
                                                                    that I have read the whole document and I give my
                                                                    consent
                                                                    to <i>AES</i> to sign
                                                                    this
                                                                    document on my
                                                                    behalf.</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row pt-4">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-2 d-grid">
                                                                <Button label="Cancel"
                                                                        className=" p-button-rounded p-button-danger  float-start"
                                                                        onClick={cancelSigningSession}/>
                                                            </div>
                                                            <div className="offset-md-8 col-md-2 d-grid">
                                                                <Button label="Approve"
                                                                        disabled={!checked}
                                                                        className="p-button-rounded p-button-success float-end"
                                                                        onClick={approveSigning}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        : <></>}
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>
    );
}

export default ApproveSigningPage;