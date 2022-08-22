import React, {useEffect} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {saveAs} from 'file-saver';
import useScroll from "../helpers/useScroll";

function DownloadPage({signingSessionId}) {

    const [executeScroll, elRef] = useScroll();
    useEffect(executeScroll, []);

    const {keycloak, initialized} = useKeycloak();

    function handleDownload() {

        var config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSessionId + '/document',
            responseType: 'blob',
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
                        <li>Download</li>
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
                                <button className="btn btn-outline-secondary" id="file-button"
                                        type="button" onClick={handleDownload}>Download
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default DownloadPage;
