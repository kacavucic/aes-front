import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {NavLink, useNavigate} from "react-router-dom";
import {Alert} from "react-bootstrap";

function InitiateSigningSessionPage({addSigningSessionId}) {

    let navigate = useNavigate();

    const {keycloak, initialized} = useKeycloak();
    const [selectedFile, setSelectedFile] = useState(null);

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


    function handleUpload(e) {
        e.preventDefault();
        const data = new FormData();
        if (selectedFile != null) {
            data.append('document', selectedFile.selectedFile,
                selectedFile.selectedFile.name);
            console.log(selectedFile.selectedFile);
        }


        let config = {
            method: 'post',
            url: 'http://localhost:8081/v1/aes/signingSessions',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + keycloak.token,
                ...data.getHeaders
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                addSigningSessionId(response.data.id);
                navigate("/sign");
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

    function onFileChange(event) {
        setSelectedFile({selectedFile: event.target.files[0]});
    }

    let activeStyle = {
        color: "#47b2e4",
    };
    let inactiveStyle = {
        color: "#444444"
    };
    return (
        <>
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
                            <div className="row">
                                <div className="col-lg-6 text-center text-lg-start">
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
                                </div>
                                <div className="col-lg-6 text-center text-lg-start">
                                    <h3>Upload Document for Signing</h3>
                                    <form onSubmit={handleUpload} encType="multipart/form-data" className="file-form">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <input type="file" className="form-control" id="file-input"
                                                       aria-describedby="inputGroupFileAddon04"
                                                       aria-label="Upload"
                                                       onChange={onFileChange}
                                                       required={true}/>
                                                <button className="btn btn-outline-secondary" type="submit"
                                                        id="file-button"

                                                >Upload
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
        </>

    );
}

export default InitiateSigningSessionPage;