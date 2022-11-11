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


function SigningSessionsPage() {
    const {keycloak, initialized} = useKeycloak();
    const [loading, setLoading] = useState(true);


    const [sessions, setSessions] = useState(null);
    const [selectedSessions, setSelectedSessions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    // TODO empty message no records found

    useEffect(() => {
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
    }, []);


    const statusBodyTemplate = (rowData) => {
        return <span
            className={`status-badge status-${rowData.status.toLowerCase().replace(/\s+/g, '')}`}>{rowData.status}</span>;
    }

    const [startDisabled, setStartDisabled] = useState(false);
    const [cancelDisabled, setCancelDisabled] = useState(false);
    const [signDisabled, setSignDisabled] = useState(false);

    function prepareMenu(rowData) {
        var status = rowData.status.toLowerCase().replace(/\s+/g, '');
        var consent = rowData.consent;

        if (status !== "pending") {
            setStartDisabled(true);

        } else {
            setStartDisabled(false);
        }

        if (status !== "pending" && status !== "inprogress") {
            setCancelDisabled(true);

        } else {
            setCancelDisabled(false);
        }
        if (status !== "inprogress") {
            setSignDisabled(true);

        } else {
            setSignDisabled(false);
        }

        if (status === "canceled") {
            if (consent === true) {
                setSignDisabled(false);
            } else {
                setSignDisabled(true);
            }

            if (consent === false) {
                setStartDisabled(false);
            } else {
                setStartDisabled(true);
            }
        }
    }

    function toggleMenu(event) {
        menu.current.toggle(event);
    }

    const menu = useRef(null);
    const items = [
        {
            label: 'Actions',
            items: [
                {
                    label: 'Start',
                    icon: 'pi pi-refresh',
                    disabled: startDisabled
                },
                {
                    label: 'Cancel',
                    icon: 'pi pi-times',
                    disabled: cancelDisabled
                },
                {
                    label: 'Sign',
                    icon: 'pi pi-pencil',
                    disabled: signDisabled
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

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Signing Sessions</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search"/>
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
            </span>
        </div>
    );
    const formatAddedOn = (value) => {

        return Intl.DateTimeFormat('sr-Latn-RS', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(value);
    }

    const formatSuspendedUntil = (value) => {

        return Intl.DateTimeFormat('sr-Latn-RS', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(value);
    }

    const addedOnBodyTemplate = (rowData) => {
        return formatAddedOn(rowData.addedOn * 1000);
    }
    const suspendedUntilBodyTemplate = (rowData) => {
        if (Date.now() > rowData.suspendedUntil * 1000) {
            return <text>/</text>
        } else {
            var suspendedUntil = new Date(rowData.suspendedUntil * 1000);
            return formatSuspendedUntil(suspendedUntil);
        }
    }

    // TODO explicitly show if consent is there because of returning from cancel state
    return (

        <>
            <main id="main">
                <section className="inner-page">
                    <section id="contact" className="contact" style={{padding: 100 + "px " + 0 + "px"}}>

                        <div className="container" data-aos="zoom-in">
                            <div className="row-col">
                                <div className="col text-center text-lg-start">
                                    <h3>Signing Sessions</h3>
                                    <p className="file-form">
                                        Start the signing process by uploading the document you want to sign. Only PDF
                                        file format is supported. The maximum allowed file size for upload is 10MB.
                                        Empty, malformed, or already signed files are not allowed.</p>
                                    <div>
                                        <div className="datatable-crud-demo">
                                            <Toast ref={toast}/>

                                            <div className="card" style={{padding: 2 + "rem", background: "white"}}>
                                                <DataTable ref={dt} value={sessions} selection={selectedSessions}
                                                           loading={loading}
                                                           sortField="addedOn" sortOrder={-1}
                                                           onSelectionChange={(e) => setSelectedSessions(e.value)}
                                                           dataKey="id" paginator rows={10}
                                                           rowsPerPageOptions={[5, 10, 25]}
                                                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} signing sessions"
                                                           globalFilter={globalFilter} header={header}
                                                           globalFilterFields={["id", "documentName"]}
                                                           responsiveLayout="scroll"
                                                           emptyMessage="No data."
                                                >
                                                    {/*<Column field="id" header="ID"/>*/}
                                                    <Column field="documentName" header="Document" sortable/>

                                                    <Column field="addedOn" header="Added On" sortable dataType="date"
                                                            body={addedOnBodyTemplate}/>
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