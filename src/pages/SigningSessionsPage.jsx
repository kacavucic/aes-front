import React, {useEffect, useRef, useState} from 'react';
import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import '../css/SigningSessionsPage.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import {Menu} from 'primereact/menu';
import {FilterMatchMode, FilterOperator} from "primereact/api";
import {useNavigate} from "react-router-dom";


function SigningSessionsPage({addSigningSessionId}) {
    const {keycloak, initialized} = useKeycloak();
    const [loading, setLoading] = useState(true);


    const [sessions, setSessions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    // TODO empty message no records found

    function getAllSigningSessions() {
        var config = {
            method: 'get',
            url: 'http://localhost:8081/v1/aes/signingSessions',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                console.log(JSON.stringify(response.data));
                setSessions(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.data.subErrors == null) {
                        setErrors(error.response.data.debugMessage);
                    } else {
                        const messages = error.response.data.subErrors.map(e => e.message);
                        setErrors(messages);
                    }
                    setLoading(false);
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
        getAllSigningSessions();
    }, []);


    const statusBodyTemplate = (rowData) => {
        return <span
            className={`status-badge status-${rowData.status.toLowerCase().replace(/\s+/g, '')}`}>{rowData.status.replace(/_/g, ' ')}</span>;
    }

    let emptySession = {
        fileName: null,
        addedAt: null,
        suspendedUntil: null,
        status: null,
        id: null,
    };
    const [session, setSession] = useState(emptySession);
    const [approveDisabled, setApproveDisabled] = useState(false);
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [signDisabled, setSignDisabled] = useState(false);

    function prepareMenu(rowData) {
        setSession({...rowData});

        var status = rowData.status.toLowerCase().replace(/\s+/g, '');

        if (status !== "pending") {
            setApproveDisabled(true);

        } else {
            setApproveDisabled(false);
        }

        if (status !== "pending" && status !== "in_progress") {
            setCancelDisabled(true);

        } else {
            setCancelDisabled(false);
        }

        if (status !== "in_progress") {
            setSignDisabled(true);

        } else {
            setSignDisabled(false);
        }

    }

    function toggleMenu(event) {
        menu.current.toggle(event);
    }

    const [errors, setErrors] = useState(null);
    const getErrorView = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Error Message',
            detail: <p style={{color: "#ff5757"}}>{errors}</p>,
            life: 10000
        });
        setErrors(null);
    }
    let navigate = useNavigate();
    const menu = useRef(null);

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    function cancelSigningSession(signingSession) {

        var config = {
            method: 'put',
            url: 'http://localhost:8081/v1/aes/signingSessions/' + signingSession.id + '/cancel',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token,
            }
        };

        axios(config)
            .then(function (response) {
                setErrors(null);
                console.log(JSON.stringify(response.data));

                let _sessions = [...sessions];
                let _session = {...session, status: "Canceled"};
                if (session.id) {
                    const index = findIndexById(signingSession.id);
                    _sessions[index] = _session;
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success Message',
                        detail: "You have successfully canceled document " + session.document.fileName + ".",
                        life: 10000
                    });
                }


                setSessions(_sessions);
                setSession(emptySession);


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


    function approveSigningSession(session) {
        addSigningSessionId(session.id);
        navigate("/approveSigning");
    }

    const items = [
        {
            label: 'Actions',
            items: [
                {
                    label: 'Review',
                    icon: 'pi pi-refresh',
                    disabled: approveDisabled,
                    command: () => {
                        approveSigningSession(session);
                    }
                },
                {
                    label: 'Cancel',
                    icon: 'pi pi-times',
                    disabled: cancelDisabled,
                    command: () => {
                        cancelSigningSession(session);
                    }

                },
                {
                    label: 'Sign',
                    icon: 'pi pi-pencil',
                    disabled: signDisabled,
                    command: () => {
                        addSigningSessionId(session.id);
                        navigate("/sign");
                    }
                }
            ]
        },
    ];

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Menu model={items} popup ref={menu}/>
                <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-secondary p-button-text float-end"
                        aria-label="Actions"
                        onClick={(event) => {
                            prepareMenu(rowData);
                            toggleMenu(event);
                        }}
                        aria-controls="popup_menu"
                        aria-haspopup/>
            </React.Fragment>
        );
    }

    const [filters, setFilters] = useState({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'addedAt': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
        'suspendedUntil': {
            operator: FilterOperator.AND,
            constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
        },

    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }


    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Signing Sessions</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange}
                           placeholder="Keyword Search"/>
            </span>
        </div>
    );
    const formatAddedAt = (value) => {

        return Intl.DateTimeFormat('sr-Latn-RS', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(value);
    }

    const formatSuspendedUntil = (value) => {

        return Intl.DateTimeFormat('sr-Latn-RS', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(value);
    }

    const addedAtBodyTemplate = (rowData) => {
        return formatAddedAt(new Date(rowData.document.addedAt * 1000));
    }
    const suspendedUntilBodyTemplate = (rowData) => {
        if (Date.now() > rowData.suspendedUntil * 1000) {
            return <div>/</div>;
        } else {
            var suspendedUntil = new Date(rowData.suspendedUntil * 1000);
            return formatSuspendedUntil(suspendedUntil);
        }
    }

    // TODO explicitly show if consent is there because of returning from cancel state
    return (

        <>
            {errors ? getErrorView() : <></>}
            <Toast ref={toast}/>
            <main id="main">
                <section className="inner-page">
                    <section id="contact" className="contact" style={{padding: 100 + "px " + 0 + "px"}}>

                        <div className="container" data-aos="zoom-in">
                            <div className="row-col">
                                <div className="col text-center text-lg-start">
                                    <h3>Signing Sessions</h3>
                                    {/*<p className="file-form">*/}
                                    {/*    Initiate the signing process by uploading the document you want to sign. Only*/}
                                    {/*    PDF*/}
                                    {/*    file format is supported. The maximum allowed file size for upload is 10MB.*/}
                                    {/*    Empty, malformed, or already signed files are not allowed.</p>*/}
                                    <div>
                                        <div className="datatable-crud-demo">
                                            <Toast ref={toast}/>

                                            <div className="card" style={{
                                                // padding: 2 + "rem",
                                                background: "white"}}>
                                                <DataTable ref={dt} value={sessions}
                                                           filters={filters} filterDisplay="menu"
                                                           rowHover
                                                           loading={loading}
                                                           sortField="document.addedAt" sortOrder={-1}
                                                           dataKey="id" paginator rows={10}
                                                           rowsPerPageOptions={[5, 10, 25]}
                                                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} signing sessions"
                                                           globalFilter={globalFilter} header={header}
                                                           globalFilterFields={["id", "documentName", "addedAt", "suspendedUntil", "status"]}
                                                           responsiveLayout="scroll"
                                                           emptyMessage="No signing sessions found."
                                                >
                                                    <Column field="id" header="ID"/>
                                                    <Column field="document.fileName" header="Document" sortable/>

                                                    <Column field="document.addedAt" header="Added At" sortable
                                                            dataType="date"
                                                            body={addedAtBodyTemplate}
                                                    />
                                                    <Column field="suspendedUntil" header="Suspended Until" sortable
                                                            dataType="date"
                                                            body={suspendedUntilBodyTemplate}/>
                                                    <Column field="status" header="Status" body={statusBodyTemplate}
                                                            sortable/>
                                                    <Column
                                                        field="id"
                                                        body={actionBodyTemplate}/>
                                                </DataTable>
                                            </div>
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