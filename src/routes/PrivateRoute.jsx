import { Navigate } from "react-router";

const PrivateRoute = () => {

    return <Navigate to="/login"></Navigate>
};

export default PrivateRoute;