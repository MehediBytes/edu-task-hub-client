import Main from "../layouts/Main/Main";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Home/Login/Login";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { createBrowserRouter } from "react-router";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([

    // Main layout routes
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <PrivateRoute> <Home></Home> </PrivateRoute>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
        ]
    },
]);