import React, {useEffect, useRef, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {useNavigate} from "react-router-dom";
import {Toast} from "primereact/toast";
import "../css/ToastStyle.css"
import {Tooltip} from "primereact/tooltip";
import {FileUpload} from "primereact/fileupload";
import axios from "axios";
import {ProgressBar} from "primereact/progressbar";
import PDFPreview from "../components/PDFPreview";
import {Tag} from "primereact/tag";
import {Steps} from "primereact/steps";

function InitiateSigningSessionPage({addSigningSessionId}) {

    const {keycloak, initialized} = useKeycloak();
    const [errors, setErrors] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [size, setSize] = useState(0);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    let navigate = useNavigate();

    useEffect(() => {

    }, [errors]);

    const getErrorView = () => {
        return toast.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: <p style={{color: "#ff5757"}}>{errors}</p>,
            life: 10000
        });
    }

    const onTemplateSelect = (e) => {
        setSelectedFile(e.files[0]);
        setSize(e.files[0].size);
        setErrors(null);
        setClearTooltip("Clear");
    }

    const onTemplateUpload = (e) => {
        const data = new FormData();
        if (selectedFile != null) {
            data.append('document', selectedFile,
                selectedFile.name);
            console.log(selectedFile);
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
                setSize(e.files[0].size || 0);
                navigate("/approveSigning");
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.data.subErrors == null) {
                        setErrors(error.response.data.debugMessage);
                    } else {
                        const messages = error.response.data.subErrors.map(e => e.message);
                        setErrors(messages);
                    }
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
    }

    const [clearTooltip, setClearTooltip] = useState("Clear");
    const onTemplateClear = () => {
        setSize(0);
        setClearTooltip(null);
    }

    const headerTemplate = (options) => {
        const {className, chooseButton, uploadButton, cancelButton} = options;
        const value = size / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(size) : '0 B';


        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 10 MB`}
                             style={{width: '300px', height: '25px', marginLeft: 'auto'}}/>
            </div>
        );
    }


    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap" style={{display: "flex"}}>
                <div className="flex align-items-center" style={{width: '40%', display: "flex"}}>
                    <PDFPreview file={file}/>
                    <span className="flex flex-column text-start ms-4" style={{display: "flex"}}>
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2 ms-auto"/>
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column" style={{display: "flex"}}>
                <i className="pi pi-image p-4" style={{
                    'fontSize': '3em',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-b)',
                    color: 'var(--surface-d)'
                }}/>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-3">Drag and Drop Document Here</span>
            </div>
        )
    }

    const chooseOptions = {
        icon: 'pi pi-fw pi-images',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined'
    };
    const uploadOptions = {
        icon: 'pi pi-fw pi-cloud-upload',
        iconOnly: true,
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
    };
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
    };

    function navigateToInitiateSigningSessionsPage() {
        navigate("/initiateSigningSession")
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
            disabled:true
        },
        {
            label: 'Sign Document',
            disabled:true
        }
    ];

    return (
        <>
            {errors ? getErrorView() : <></>}
            <main id="main">
                <section id="breadcrumbs" className="breadcrumbs">
                    <div id="steps" className="container">
                        <Steps model={items} activeIndex={0}
                               readOnly={false}/>
                    </div>
                </section>
                <section className="inner-page">
                    <section id="contact" className="contact">
                        <div className="container" data-aos="zoom-in">
                            <div className="row-col">
                                <div className="col text-center text-lg-start">
                                    <h3>Upload Document for Signing</h3>
                                    <p className="file-form">
                                        Initiate the signing process by uploading the document you want to sign. Only PDF
                                        file format is supported. The maximum allowed file size for upload is 10MB.
                                        Empty, malformed, or already signed files are not allowed.</p>
                                    <div>
                                        <Toast ref={toast}/>

                                        <Tooltip target=".custom-choose-btn" content="Choose" position="bottom"/>
                                        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom"/>
                                        <Tooltip target=".custom-cancel-btn" content={clearTooltip} position="bottom"/>

                                        <div className="card" style={{padding: 2 + "rem", background: "white"}}>
                                            <FileUpload ref={fileUploadRef}
                                                        customUpload
                                                        uploadHandler={onTemplateUpload}
                                                        accept=".pdf"
                                                        maxFileSize={10000000}
                                                        onUpload={onTemplateUpload} onSelect={onTemplateSelect}
                                                        onError={onTemplateClear}
                                                        onClear={onTemplateClear}
                                                        headerTemplate={headerTemplate} itemTemplate={itemTemplate}
                                                        emptyTemplate={emptyTemplate}
                                                        chooseOptions={chooseOptions} uploadOptions={uploadOptions}
                                                        cancelOptions={cancelOptions}
                                                        invalidFileSizeMessageDetail={"; maximum upload size is {0}."}
                                                        invalidFileSizeMessageSummary={"{0}: Invalid file size"}/>
                                        </div>
                                    </div>

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