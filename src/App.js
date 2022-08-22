import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import React, {useState} from "react";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./Keycloak"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./helpers/PrivateRoute";
import InitiateSigningSessionPage from "./pages/InitiateSigningSessionPage";
import Loading from "./components/Loading";
import SignPage from "./pages/SignPage";
import DownloadPage from "./pages/DownloadPage";

function App() {

    // function onKeycloakEvent(event, error) {
    //     console.log('onKeycloakEvent', event, error);
    // }

    // function onKeycloakTokens(tokens) {
    //     console.log('onKeycloakTokens', tokens);
    // }

    const [signingSessionId, setSigningSessionId] = useState("");

    function addSigningSessionId(id) {
        setSigningSessionId(id);
    }

    const [section, setSection] = useState("");

    function addSection(section) {
        setSection(section);
    }

    return (
        // <div id="page-container">
        //     <div id="content-wrap">
                <>
                    <ReactKeycloakProvider
                        authClient={keycloak}
                        initOptions={{
                            onLoad: "check-sso",
                            silentCheckSsoRedirectUri:
                                window.location.origin + "/silent-check-sso.html"
                        }}
                        // onEvent={onKeycloakEvent}
                        // onTokens={onKeycloakTokens}
                        LoadingComponent={<Loading/>}
                    >

                        <BrowserRouter>
                            <NavBar addSection={addSection}/>
                            {/*<Intro/>*/}
                            <Routes>
                                <Route exact path="/" element={<HomePage section={section} addSection={addSection}/>}/>
                                <Route path="/initiateSigningSession" element={
                                    <PrivateRoute>
                                        <InitiateSigningSessionPage addSigningSessionId={addSigningSessionId}/>
                                    </PrivateRoute>}/>
                                <Route path="/sign" element={
                                    <PrivateRoute>
                                        <SignPage signingSessionId={signingSessionId}/>
                                    </PrivateRoute>}/>
                                <Route path="/download" element={
                                    <PrivateRoute>
                                        <DownloadPage signingSessionId={signingSessionId}/>
                                    </PrivateRoute>}/>
                            </Routes>
                            <Footer/>
                        </BrowserRouter>

                    </ReactKeycloakProvider>
                </>
        //     </div>
        // </div>


    );
}

export default App;
