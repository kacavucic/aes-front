// import Keycloak from "keycloak-js";
const Keycloak = window.Keycloak;

const keycloak = new Keycloak({
    url: "http://localhost:8083/auth",
    realm: "aes",
    clientId: "aes-app",
});

export default keycloak;