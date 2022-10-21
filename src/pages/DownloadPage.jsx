import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {saveAs} from 'file-saver';
import {NavLink} from "react-router-dom";
import {Alert} from "react-bootstrap";

function DownloadPage({signingSessionId}) {

    const {keycloak, initialized} = useKeycloak();

    const [errors, setErrors] = useState(null)
    useEffect(() => {

    }, [errors]);

    const getErrorView = () => {
        return (
            <Alert variant={"danger"}>
                {errors.map((error) => <li key={error}>{error}</li>)}
            </Alert>
        )
    }

    function handleDownload() {
        let resType;
        if (errors == null) {
            resType = 'blob';
        } else {
            resType = 'json';
        }

        let config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/document',

            responseType: resType,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));

                const fileNameHeader = "x-suggested-filename";
                // console.log("Resp heads: " + JSON.stringify(response.headers));
                const suggestedFileName = response.headers[fileNameHeader];
                const effectiveFileName = (suggestedFileName === undefined
                    ? "Effective File Name"
                    : suggestedFileName);
                // console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);

                saveAs(response.data, effectiveFileName);

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
                    // The client never received a response, and the request was never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    let activeStyle = {
        color: "#47b2e4",
    };
    let inactiveStyle = {
        color: "#444444"
    };

    return (
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
                        <li><NavLink to="/download" style={({isActive}) =>
                            isActive ? activeStyle : inactiveStyle
                        }>Download</NavLink></li>
                    </ol>
                    <h2>Download Signed Document</h2>

                </div>
            </section>

            <section className="inner-page">
                <section id="contact" className="contact">
                    <div className="container" data-aos="zoom-in">
                        <div className="row">
                            <div className="col-lg-6 text-center text-lg-start">
                                <h3>One more step...</h3>
                                <p className="file-form"> An OTP has been sent to your email address. Please enter it
                                    here to
                                    complete the document signing process. By providing a valid OTP you are giving
                                    <i> AES</i> the consent to sign previously uploaded document on your behalf.</p>
                            </div>
                            <div className="col-lg-6 text-center text-lg-start">
                                <h3>Download Signed Document</h3>
                                <div className="file-form">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <button className="btn btn-outline-secondary float-end" id="file-button"
                                                    type="button" onClick={handleDownload}
                                                    style={{marginLeft: 0 + 'px'}}>Download
                                            </button>

                                        </div>
                                    </div>
                                </div>
                                {errors ? getErrorView() : <></>}
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default DownloadPage;
