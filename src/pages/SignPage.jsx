import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {NavLink, useNavigate} from "react-router-dom";
import {Alert} from "react-bootstrap";

function SignPage({signingSessionId}) {

    let navigate = useNavigate();

    const {keycloak, initialized} = useKeycloak();
    const [otp, setOtp] = useState("");

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

    function handleChange(e) {
        setOtp(e.target.value);
        // console.log("OTP entered: " + otp);
    }

    function handleSign(e) {
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
                console.log(JSON.stringify(response.data));
                navigate("/download");
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
        <main
            id="main">

            <section id="breadcrumbs" className="breadcrumbs">
                <div className="container">

                    <ol>
                        <li><NavLink to="/" style={({isActive}) =>
                            isActive ? activeStyle : inactiveStyle
                        }>Home</NavLink></li>
                        <li><NavLink to="/initiateSigningSession" style={({isActive}) =>
                            isActive ? activeStyle : inactiveStyle
                        }>Initiate Signing Session</NavLink></li>
                        <li><NavLink to="/sign" style={({isActive}) =>
                            isActive ? activeStyle : inactiveStyle
                        }>Sign</NavLink></li>
                    </ol>
                    <h2>Sign Document</h2>

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
                                <h3>Sign Document</h3>
                                <form onSubmit={handleSign} className="file-form">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <input type="text" className="form-control" name="otp" id="file-input"
                                                   placeholder="Enter OTP"
                                                   onChange={handleChange}
                                                   required/>
                                            <button className="btn btn-outline-secondary" id="file-button"
                                                    type="submit">Sign
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                {errors ? getErrorView() : <></>}
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default SignPage;
