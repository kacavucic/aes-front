import React from "react";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {useState} from "react";

function InitiateSigningSessionPage() {

    const {keycloak, initialized} = useKeycloak();

    function upload() {
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
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [selectedFile, setSelectedFile] = useState(null);

    function onFileChange(event) {
        setSelectedFile({selectedFile: event.target.files[0]});
    }

    return (
        <main id="main">

            <section id="breadcrumbs" className="breadcrumbs">
                <div className="container">

                    <ol>
                        <li><a href="index.html">Home</a></li>
                        <li>Initiate Signing Session</li>
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
                                                        // onClick={upload}
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
    );
}

export default InitiateSigningSessionPage;