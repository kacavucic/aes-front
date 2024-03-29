import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import React, {useState} from "react";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./helpers/PrivateRoute";
import InitiateSigningSessionPage from "./pages/InitiateSigningSessionPage";
import SigningSessionsPage from "./pages/SigningSessionsPage";
// import Loading from "./components/Loading";
import SignPage from "./pages/SignPage";
import ScrollToTop from "./helpers/ScrollToTop";
import Loading from "./components/Loading";
import ApproveSigningPage from "./pages/ApproveSigningPage";
import "./css/ToastStyle.css";

function App() {


    // function onKeycloakEvent(event, error) {
    //     console.log('onKeycloakEvent', event, error);
    // }

    // function onKeycloakTokens(tokens) {
    //     console.log('onKeycloakTokens', tokens);
    // }

    const [signingSessionId, setSigningSessionId] = useState("-1");

    function addSigningSessionId(id) {
        setSigningSessionId(id);
    }

    const [section, setSection] = useState("");

    function addSection(section) {
        setSection(section);
    }

    return (
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
                <Routes>
                    <Route exact path="/" element={<HomePage section={section} addSection={addSection}/>}/>
                    <Route path="/initiateSigningSession"
                           element={
                               <PrivateRoute>
                                   <ScrollToTop>
                                       <InitiateSigningSessionPage addSigningSessionId={addSigningSessionId}/>
                                   </ScrollToTop>
                               </PrivateRoute>
                           }
                    />
                    <Route path="/approveSigning"
                           element={
                               <PrivateRoute>
                                   <ScrollToTop>
                                       <ApproveSigningPage signingSessionId={signingSessionId} addSection={addSection}/>
                                   </ScrollToTop>
                               </PrivateRoute>
                           }
                    />
                    <Route path="/sign" element={
                        <PrivateRoute>
                            <ScrollToTop>
                                <SignPage signingSessionId={signingSessionId} addSection={addSection}/>
                            </ScrollToTop>
                        </PrivateRoute>}/>

                    <Route path="/signingSessions"
                           element={
                               <PrivateRoute>
                                   <ScrollToTop>
                                       <SigningSessionsPage addSigningSessionId={addSigningSessionId}/>
                                   </ScrollToTop>
                               </PrivateRoute>
                           }
                    />
                </Routes>
                <Footer addSection={addSection}/>
            </BrowserRouter>
        </ReactKeycloakProvider>

    );
}

export default App;
