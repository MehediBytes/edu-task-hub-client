import { Outlet } from "react-router";

const Root = () => {
    return (
        <div>
            <h2>Root</h2>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;