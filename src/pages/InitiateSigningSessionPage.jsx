import React, {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {NavLink, useNavigate} from "react-router-dom";
import useScroll from "../helpers/useScroll"

function InitiateSigningSessionPage({addSigningSessionId}) {

    let navigate = useNavigate();
    const [executeScroll, elRef] = useScroll("center");
    useEffect(executeScroll, []);

    const {keycloak, initialized} = useKeycloak();
    const [selectedFile, setSelectedFile] = useState(null);


    function handleUpload() {
        const data = new FormData();
        data.append('document', selectedFile.selectedFile,
            selectedFile.selectedFile.name);
        console.log(selectedFile.selectedFile);

        var config = {
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
                console.log(error);
            });
    }

    function onFileChange(event) {
        setSelectedFile({selectedFile: event.target.files[0]});
    }

    let activeStyle = {
        color: "#47b2e4",
    };
    let inactiveStyle = {
        color:"#444444"
    };
    return (
        <>
            {/*<Intro/>*/}
            <main ref={elRef} id="main">

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
                                    <p className="file-form"> Duis aute irure dolor in reprehenderit in
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
                                    <form encType="multipart/form-data" method="post" className="file-form">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <input type="file" className="form-control" id="file-input"
                                                       aria-describedby="inputGroupFileAddon04"
                                                       aria-label="Upload"
                                                       onChange={onFileChange}/>
                                                <button className="btn btn-outline-secondary" type="button"
                                                        id="file-button"
                                                        onClick={handleUpload}
                                                >Upload
                                                </button>
                                            </div>
                                        </div>
                                    </form>
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