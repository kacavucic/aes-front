import React, {useRef, useState} from 'react';
import {Toast} from 'primereact/toast';
import {FileUpload} from 'primereact/fileupload';
import {ProgressBar} from 'primereact/progressbar';
import {Button} from 'primereact/button';
import {Tooltip} from 'primereact/tooltip';
import {Tag} from 'primereact/tag';
import axios from "axios";
import PDFPreview from "./PDFPreview";

function Uploader({keycloak, addSigningSessionId, errors, addErrors, addDoc}) {

    const [selectedFile, setSelectedFile] = useState(null);
    const [size, setSize] = useState(0);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        setSelectedFile(e.files[0]);
        setSize(e.files[0].size);
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
                toast.current.show({severity: 'info', summary: 'Success', detail: 'Document Uploaded'});
                addErrors(null);
                showDocument(response.data.id);
                // navigate("/sign");
            })
            .catch(function (error) {
                if (error.response) {
                    addErrors(error.response.data.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(error.response.data));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    addErrors(error.request);
                    // The client never received a response, and the request was never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    addErrors(error);
                    // Anything else
                    console.log('Error', error.message);
                }
            });
    }

    function showDocument(signingSessionId) {

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

                addDoc(response.data);
                // saveAs(response.data, effectiveFileName);

            })
            .catch(function (error) {
                if (error.response) {
                    addErrors(error.response.data.errors);
                    // The client was given an error response (5xx, 4xx)
                    console.log("Response Error: " + JSON.stringify(error));
                    console.log("Response Error Data: " + JSON.stringify(error.response.data));
                    console.log("Response Error Status: " + JSON.stringify(error.response.status));
                    console.log("Response Error Headers: " + JSON.stringify(error.response.headers));
                } else if (error.request) {
                    addErrors(error.request);
                    // The client never received a response, and the request was never left
                    console.log("Request Error")
                    console.log(error.request);
                } else {
                    addErrors(error);
                    // Anything else
                    console.log('Error', error.message);
                }
            });

    }

    const onTemplateRemove = (file, callback) => {
        setSize(size - file.size);
        addDoc(null);
        callback();
    }

    const onTemplateClear = () => {
        setSize(0);
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
                    {/*<img alt={file.name} role="presentation"  src={URL.createObjectURL(selectedFile)} width={100}/>*/}
                    <PDFPreview file={file}/>
                    <span className="flex flex-column text-start ms-3" style={{display: "flex"}}>
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2 ms-3"/>
                <Button type="button" icon="pi pi-times"
                        className="p-button-outlined p-button-rounded p-button-danger ms-auto"
                        onClick={() => onTemplateRemove(file, props.onRemove)}/>
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

    return (
        <div>
            <Toast ref={toast}/>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom"/>
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom"/>
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom"/>

            <div className="card" style={{padding: 2 + "rem", background: "white"}}>
                {/*<h5>Upload Document For Signing</h5>*/}
                <FileUpload ref={fileUploadRef}
                            customUpload
                            uploadHandler={onTemplateUpload}
                            accept=".pdf"
                            maxFileSize={10000000}
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear}
                            onClear={onTemplateClear}
                            headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                            chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                            invalidFileSizeMessageDetail={"; maximum upload size is {0}."}
                            invalidFileSizeMessageSummary={"{0}: Invalid file size"}/>
            </div>
        </div>
    )

}

export default Uploader;

