import React, {useEffect, useRef, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import axios from "axios";
import {Toast} from "primereact/toast";
import {TabPanel, TabView} from 'primereact/tabview';
import OtpInput from "react18-input-otp";
import {saveAs} from 'file-saver';
import {Steps} from "primereact/steps";
import {Chip} from "primereact/chip";

function SignPage({signingSessionId}) {

    const {keycloak, initialized} = useKeycloak();
    const [errors, setErrors] = useState(null)

    let navigate = useNavigate();
    const toast = useRef(null);

    const [otp, setOtp] = useState('');
    const numInputs = 6;

    const [signingSession, setSigningSession] = useState({
        signingSession: false,
        documentName: null,
        otpAttempts: 0,
        status: null
    });

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
                    otpAttempts: response.data.otpAttempts,
                    status: response.data.status,
                    signingSession: true
                })
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

    useEffect(() => {
        getSigningSession();
    }, []);

    const handleOtpChange = (otp) => {
        setErrors(null);
        setOtp(otp);
    };

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        let data = JSON.stringify({
            "otp": otp
        });

        let config = {
            method: 'post',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/sign',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token,
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                console.log(JSON.stringify(response.data));
                toast.current.show({
                    severity: 'success',
                    summary: 'Success Message',
                    detail: response.data.confirmationMessage,
                    life: 10000
                });
                setDownloadDisabled(false);
                setActiveIndex(1);
                setSignDisabled(true);
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
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    };

    function handleResend() {

        var config = {
            method: 'put',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/resendOTP',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                setSigningSession(signingSession => ({...signingSession, otpAttempts: response.data.otpAttempts}))
                toast.current.show({
                    severity: 'success',
                    summary: 'Success Message',
                    detail:
                        <span>An OTP code has been sent to<b>&nbsp;{keycloak.tokenParsed.preferred_username}</b></span>,
                    life: 10000
                });
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

    const getErrorView = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: <p style={{color: "#ff5757"}}>{errors}</p>,
            life: 10000
        });
        setErrors(null);
    }

    function navigateToInitiateSigningSessionsPage() {
        navigate("/initiateSigningSession")
    }

    function navigateToApproveSigningPage() {
        navigate("/approveSigning")
    }

    function navigateToSignPage() {
        navigate("/sign")
    }

    function handleDownload() {
        let config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/document',

            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                // console.log(JSON.stringify(response.data));
                const fileNameHeader = "x-suggested-filename";
                // console.log("Resp heads: " + JSON.stringify(response.headers));
                const suggestedFileName = response.headers[fileNameHeader];
                const effectiveFileName = (suggestedFileName === undefined
                    ? "Effective File Name"
                    : suggestedFileName);
                console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);
                var blob = new Blob([response.data], {type: "application/pdf"});
                saveAs(blob, effectiveFileName);

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
                    // The client never received a response, and the request was never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    setErrors(error.message);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    const [downloadDisabled, setDownloadDisabled] = useState(true);
    const [signDisabled, setSignDisabled] = useState(false);

    const maxOtpAttempts = 3;

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
            command: () => {
                navigateToSignPage();
            }
        }
    ];
    return (
        <>
            {errors ? getErrorView() : <></>}
            <Toast ref={toast} style={{zIndex: 1000}}
            />
            <main
                id="main">
                <section id="breadcrumbs" className="breadcrumbs">
                    <div id="steps" className="container">
                        <Steps model={items} activeIndex={2}
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
                                            <h3>Sign And Download Document</h3>

                                        </div>
                                        <div className="col text-end">
                                            {signingSession.signingSession ? <Chip label={signingSession.documentName}
                                                                                   icon="pi pi-file-pdf"
                                                                                   className="mr-2 mb-2"/> : <></>}
                                        </div>
                                    </div>
                                    <p className="file-form"> An OTP has been sent to your email address. Please enter
                                        it
                                        here to
                                        complete the document signing process. If your OTP becomes invalid due to
                                        inactivity, you are able to request for OTP to be sent again to your email
                                        address. The maximum number of times you can request for a new OTP per
                                        signing session is 3, after which your signing session becomes suspended for
                                        half an hour. You are given 3 chances to enter your
                                        OTP correctly in order to complete the document signing process, otherwise your
                                        signing session becomes rejected.</p>
                                    {signingSession.signingSession ?
                                        <div id="otp_form" className="col text-center text-lg-start ms-auto me-auto">
                                            <TabView activeIndex={activeIndex}
                                                     onTabChange={(e) => setActiveIndex(e.index)}>
                                                <TabPanel header="Sign Document" disabled={signDisabled}>
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="d-flex flex-column">
                                                            <div className="pt-2 text-center">
                                                                <span>An OTP code has been sent to<b>&nbsp;{keycloak.tokenParsed.preferred_username}</b></span>
                                                            </div>
                                                            <div className="pt-3">
                                                                <OtpInput
                                                                    containerStyle={{justifyContent: "center"}}
                                                                    id="otp-input"
                                                                    autoComplete="one-time-code"
                                                                    inputStyle="inputStyle"
                                                                    numInputs={numInputs}
                                                                    onChange={handleOtpChange}
                                                                    separator={<span>-</span>}
                                                                    isInputNum={true}
                                                                    shouldAutoFocus
                                                                    value={otp}
                                                                />
                                                            </div>
                                                            <div className="pt-5 text-center">
                                                                <div className="container-fluid">
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div
                                                                                className="col-md-2 d-grid ms-auto me-auto">
                                                                                <Button label="Sign"
                                                                                        disabled={otp.length < numInputs}
                                                                                        className="p-button-rounded p-button-success float-start"
                                                                                        type="submit"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12 pt-2">
                                                                            <span>Didn't receive the code?
                                                                                <br/>
                                                                                <a role="button"
                                                                                   onClick={handleResend}
                                                                                   className="getstarted"> Resend [{signingSession.otpAttempts + "/" + maxOtpAttempts}]</a></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </TabPanel>
                                                <TabPanel header="Download"
                                                          disabled={downloadDisabled}>
                                                    <div className="d-flex flex-column">
                                                        <div className="pt-2 text-center">
                                                          <span>
                                        {keycloak.tokenParsed.given_name}, AES has successfully signed document on your behalf!</span>
                                                        </div>
                                                        <div className="pt-4 text-center">
                                                            <Button label="Download"
                                                                    className="p-button-rounded p-button-info"
                                                                    onClick={handleDownload}
                                                                    type="button"
                                                            />
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                            </TabView>
                                        </div>
                                        : <></>}
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>

        // TODO navigacija sa / na svakoj stranici i vracanje na prethodni korak
    );
}

export default SignPage;
