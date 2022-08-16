import './App.css';
import NavBar from './components/NavBar';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import qs from "qs";
import axios from "axios";

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const server = "http://localhost:8083";
    const realm = "aes"
    const responseType = "code";
    const clientId = 'aes-app';
    const redirectUri = 'http://localhost:3000/';

    // const clientSecret = "";
    const grantType = 'authorization_code';

    function addLoggedIn(loggedIn) {
        setLoggedIn(loggedIn)
    }

    function login(e) {
        e.preventDefault();
        window.location.href = server + "/auth/realms/" + realm + "/protocol/openid-connect/auth?response_type="
            + responseType + "&client_id=" + clientId + "&redirect_uri=" + redirectUri;
    }

    function logout(e) {
        e.preventDefault();
        removeCookie("access_token");
        window.location.reload();
    }

    function checkCredentials() {
        if (cookies.access_token != null) {
            return true;
        } else {
            return false;
        }
    }

    function saveToken(token) {
        var expireDate = new Date().getTime() + (1000 * token.expires_in);
        var datum = new Date(expireDate);
        setCookie("access_token", token.access_token, {expires: datum});
        console.log('Obtained Access token');
        window.location.href = redirectUri;
    }

    function retrieveToken(code) {

        var data = qs.stringify({
            'code': code,
            'client_id': clientId,
            // 'client_secret': clientSecret,
            'redirect_uri': redirectUri,
            'grant_type': grantType
        });
        var config = {
            method: 'post',
            url: server + "/auth/realms/" + realm + "/protocol/openid-connect/token",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                saveToken(response.data);
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        setLoggedIn(checkCredentials());
        let i = window.location.href.indexOf('code');
        if (!loggedIn && i != -1) {
            retrieveToken(window.location.href.substring(i + 5));
        }
    }, []);

    return (
        <div id="page-container">
            <div id="content-wrap">
                <BrowserRouter className="App">
                    <NavBar loggedIn={loggedIn} login={login} logout={logout}/>
                    <Routes>
                        <Route exact path="/" element={<HomePage loggedIn={loggedIn} login={login}/>}/>
                    </Routes>
                    <Footer></Footer>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
