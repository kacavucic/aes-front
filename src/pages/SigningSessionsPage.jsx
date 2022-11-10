import React, {useEffect, useRef, useState} from 'react';
import {NavLink} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import '../css/SigningSessionsPage.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';


function SigningSessionsPage() {
    const {keycloak, initialized} = useKeycloak();
    const [loading, setLoading] = useState(true);

    let activeStyle = {
        color: "#47b2e4",
    };
    let inactiveStyle = {
        color: "#444444"
    };


    let emptySession = {
        id: null,
        document: '',
        date: '',
        attempts: 0,
        status: 'PENDING'
    };

    const [sessions, setSessions] = useState(null);
    const [deleteSessionDialog, setDeleteSessionDialog] = useState(false);
    const [deleteSessionsDialog, setDeleteSessionsDialog] = useState(false);
    const [session, setSession] = useState(emptySession);
    const [selectedSessions, setSelectedSessions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    useEffect(() => {
        if (sessions == null) {

            var config = {
                method: 'get',
                url: 'http://localhost:8081/v1/aes/signingSessions',
                headers: {
                    'Authorization': 'Bearer ' + keycloak.token,
                }
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    setSessions(response.data.signingSessions);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }, [sessions]);

    const hideDeleteSessionDialog = () => {
        setDeleteSessionDialog(false);
    }

    const hideDeleteSessionsDialog = () => {
        setDeleteSessionsDialog(false);
    }

    const confirmDeleteSession = (session) => {
        setSession(session);
        setDeleteSessionDialog(true);
    }

    const deleteSession = () => {
        let _sessions = sessions.filter(val => val.id !== session.id);
        setSessions(_sessions);
        setDeleteSessionDialog(false);
        setSession(emptySession);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Signing Session Deleted', life: 10000});
    }

    const confirmDeleteSelected = () => {
        setDeleteSessionsDialog(true);
    }

    const deleteSelectedSessions = () => {
        let _sessions = sessions.filter(val => !selectedSessions.includes(val));
        setSessions(_sessions);
        setDeleteSessionsDialog(false);
        setSelectedSessions(null);
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Signing Sessions Deleted',
            life: 10000
        });
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Upload New Document" icon="pi pi-plus" className="p-button-success me-2"/>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected}
                        disabled={!selectedSessions || !selectedSessions.length}/>
            </React.Fragment>
        )
    }


    // TODO canceled color
    const statusBodyTemplate = (rowData) => {
        return <span className={`status-badge status-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/*<Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"*/}
                {/*        onClick={() => editSession(rowData)}/>*/}
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning"
                        onClick={() => confirmDeleteSession(rowData)}/>
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Signing Sessions</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );

    const deleteSessionDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSessionDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSession}/>
        </React.Fragment>
    );
    const deleteSessionsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSessionsDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedSessions}/>
        </React.Fragment>
    );

    return (

        <>
            <main id="main">
                <section id="breadcrumbs" className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><NavLink to="/" style={({isActive}) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Home</NavLink></li>
                            <li><NavLink to="/signingSessions" style={({isActive}) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Signing Sessions</NavLink></li>
                        </ol>
                        <h2>Signing Sessions</h2>
                    </div>
                </section>

                <section className="inner-page">
                    <section id="contact" className="contact">
                        <div className="container" data-aos="zoom-in">
                            <div className="row-col">
                                <div className="col text-center text-lg-start">
                                    <h3>Upload Document for Signing</h3>
                                    <p className="file-form">
                                        Start the signing process by uploading the document you want to sign. Only PDF
                                        file format is supported. The maximum allowed file size for upload is 10MB.
                                        Empty, malformed, or already signed files are not allowed.</p>
                                    <div>
                                        <div className="datatable-crud-demo">
                                            <Toast ref={toast}/>

                                            <div className="card" style={{padding: 2 + "rem", background: "white"}}>
                                                <Toolbar className="mb-4" left={leftToolbarTemplate}/>

                                                <DataTable ref={dt} value={sessions} selection={selectedSessions}
                                                           loading={loading}

                                                           onSelectionChange={(e) => setSelectedSessions(e.value)}
                                                           dataKey="id" paginator rows={10}
                                                           rowsPerPageOptions={[5, 10, 25]}
                                                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} signing sessions"
                                                           globalFilter={globalFilter} header={header}
                                                           globalFilterFields={["id", "documentName"]}
                                                           responsiveLayout="scroll">
                                                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}}
                                                            exportable={false}/>
                                                    <Column field="id" header="ID" sortable
                                                            style={{minWidth: '12rem'}}/>
                                                    <Column field="documentName" header="Document" sortable
                                                            style={{minWidth: '16rem'}}/>

                                                    <Column field="addedOn" header="Added On" sortable
                                                            style={{minWidth: '10rem'}}/>
                                                    <Column field="attempts" header="Attempts" sortable/>
                                                    <Column field="status" header="Status" body={statusBodyTemplate}
                                                            sortable
                                                            style={{minWidth: '12rem'}}/>
                                                    <Column body={actionBodyTemplate} exportable={false}
                                                            style={{minWidth: '8rem'}}/>
                                                </DataTable>
                                            </div>

                                            <Dialog visible={deleteSessionDialog} header="Confirm"
                                                    modal
                                                    footer={deleteSessionDialogFooter} onHide={hideDeleteSessionDialog}>
                                                <div className="confirmation-content">
                                                    <i className="pi pi-exclamation-triangle me-3"
                                                       style={{fontSize: '2rem'}}/>
                                                    {session &&
                                                    <span>Are you sure you want to delete <b>{session.documentName}</b>?</span>}
                                                </div>
                                            </Dialog>

                                            <Dialog visible={deleteSessionsDialog} header="Confirm"
                                                    modal
                                                    footer={deleteSessionsDialogFooter}
                                                    onHide={hideDeleteSessionsDialog}>
                                                <div className="confirmation-content">
                                                    <i className="pi pi-exclamation-triangle me-3"
                                                       style={{fontSize: '2rem'}}/>
                                                    {session &&
                                                    <span>Are you sure you want to delete the selected signing sessions?</span>}
                                                </div>
                                            </Dialog>
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

export default SigningSessionsPage;