import {useKeycloak} from "@react-keycloak/web";
import Loading from "../components/Loading";

const PrivateRoute = ({children}) => {
    const {keycloak} = useKeycloak();

    // const isLoggedIn = keycloak.authenticated;

    // return isLoggedIn ? children : keycloak.login();

    const url = keycloak.createLoginUrl();
    console.log(url);

    if (keycloak.authenticated) {
        return children;
    } else {
        keycloak.login();
        return <Loading/>

    }
};

export default PrivateRoute;