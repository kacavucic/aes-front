import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import useScroll from "../helpers/useScroll";

var qs = require('qs');

function SignPage({signingSessionId}) {

    let navigate = useNavigate();
    const [executeScroll, elRef] = useScroll();
    useEffect(executeScroll, []);

    const {keycloak, initialized} = useKeycloak();
    const [otp, setOtp] = useState("");

    function handleChange(e) {
        setOtp(e.target.value);
        // console.log("OTP entered: " + otp);
    }

    function handleSign(e) {
        e.preventDefault();

        var data = JSON.stringify({
            "otp": otp
        });

        var config = {
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
                console.log(error);
            });

    }

    return (
        <main ref={elRef} id="main">

            <section id="breadcrumbs" className="breadcrumbs">
                <div className="container">

                    <ol>
                        <li><a href="index.html">Home</a></li>
                        <li>Initiate Signing Session</li>
                        <li>Sign</li>
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
                                        <label id="otp-label" className="lead" htmlFor="name">OTP</label>
                                        <input type="text" className="form-control" name="otp" id="file-input"
                                               placeholder="Enter OTP code"
                                               onChange={handleChange}
                                               required/>
                                    </div>
                                    <div className="text-end mt-3">
                                        <button className="btn btn-outline-secondary" id="file-button"
                                                type="submit">Sign
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default SignPage;
