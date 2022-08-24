import Keycloak from 'keycloak-js'
// const Keycloak = window.Keycloak;

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    url: "http://localhost:8083/auth",
    realm: "aes",
    clientId: "aes-app",
})

export default keycloak