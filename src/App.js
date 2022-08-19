import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import React from "react";
import Hero from "./components/Hero";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./Keycloak"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./helpers/PrivateRoute";
import InitiateSigningSessionPage from "./pages/InitiateSigningSessionPage";
import Loading from "./components/Loading";

function App() {

    function onKeycloakEvent(event, error) {
        console.log('onKeycloakEvent', event, error);
    }

    // function onKeycloakTokens(tokens) {
    //     console.log('onKeycloakTokens', tokens);
    // }

    return (
        <div id="page-container">
            <div id="content-wrap">
                <div>
                    <ReactKeycloakProvider
                        authClient={keycloak}
                        initOptions={{
                            onLoad: "check-sso",
                            silentCheckSsoRedirectUri:
                                window.location.origin + "/silent-check-sso.html"
                        }}
                        onEvent={onKeycloakEvent}
                        // onTokens={onKeycloakTokens}
                        LoadingComponent={<Loading />}
                    >
                        <NavBar/>
                        <Hero/>
                        <BrowserRouter>
                            <Routes>
                                <Route exact path="/" element={<HomePage/>}/>
                                <Route path="/initiateSigningSession" element={
                                    <PrivateRoute>
                                        <InitiateSigningSessionPage/>
                                    </PrivateRoute>}/>
                            </Routes>
                        </BrowserRouter>
                        <Footer/>
                    </ReactKeycloakProvider>
                </div>
            </div>
        </div>


    );
}

export default App;
