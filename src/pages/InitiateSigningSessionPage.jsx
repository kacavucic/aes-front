import React, {useEffect, useRef, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {NavLink} from "react-router-dom";
import Uploader from "../components/Uploader";
import PDFViewer from "../components/PDFViewer";
import {Toast} from "primereact/toast";
import "../css/ToastStyle.css"

function InitiateSigningSessionPage({addSigningSessionId}) {

    const {keycloak, initialized} = useKeycloak();
    const [errors, setErrors] = useState(null);

    function addErrors(errors) {
        setErrors(errors);
    }

    const [doc, setDoc] = useState(null);

    function addDoc(doc) {
        setDoc(doc);
    }

    useEffect(() => {

    }, [errors, doc]);


    const toast = useRef(null);

    const getErrorView = () => {
        return toast.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: errors.map((error) => <p key={error}>{error}</p>),
            life: 3000
        });
    }


    const getPDFView = () => {
        return (<div className="col text-center text-lg-start" style={{paddingTop: 60 + "px"}}>
            <h3>Uploaded Document</h3>
            <p className="file-form">
                Duis aute irure dolor in reprehenderit in
                voluptate
                velit
                esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt
                in
                culpa
                qui officia deserunt mollit anim id est laborum.
            </p>
            <PDFViewer doc={doc}/>
        </div>);
    }

    let activeStyle = {
        color: "#47b2e4",
    };
    let inactiveStyle = {
        color: "#444444"
    };
    return (
        <>
            <Toast ref={toast}/>
            <main id="main">

                <section id="breadcrumbs" className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><NavLink to="/" style={({isActive}) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Home</NavLink></li>
                            <li><NavLink to="/initiateSigningSession" style={({isActive}) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Initiate Signing Session</NavLink></li>
                        </ol>
                        <h2>Initiate Signing Session</h2>
                    </div>
                </section>

                <section className="inner-page">
                    <section id="contact" className="contact">
                        <div className="container" data-aos="zoom-in">
                            <div className="row-col">
                                <div className="col text-center text-lg-start">
                                    <h3>Upload Document for Signing</h3>
                                    <p className="file-form">
                                        Duis aute irure dolor in reprehenderit in
                                        voluptate
                                        velit
                                        esse cillum dolore eu
                                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                                        proident, sunt
                                        in
                                        culpa
                                        qui officia deserunt mollit anim id est laborum.</p>

                                    <Uploader keycloak={keycloak} addSigningSessionId={addSigningSessionId}
                                              errors={errors}
                                              addErrors={addErrors} addDoc={addDoc}/>
                                </div>
                                {!errors && doc ? getPDFView() : <></>}
                                {errors ? getErrorView() : <></>}
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>

    );
}

export default InitiateSigningSessionPage;