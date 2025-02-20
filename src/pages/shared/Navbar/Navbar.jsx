import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogout = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "You are now loged out",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Problem in log out.", error,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    };

    return (
        <div className="bg-purple-500">
            <div className="navbar text-base-100 container mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                    </div>
                    <Link to={"/"} className="text-2xl font-bold">Edu-Task-Hub</Link>
                </div>
                <div className="navbar-end">
                    {
                        user && user?.email && <div className='flex items-center gap-2'>
                            <div className='border rounded-full'>
                                <img className="w-10 h-10 rounded-full cursor-pointer"
                                    referrerPolicy="no-referrer"
                                    src={user?.photoURL || "None"}
                                    alt={user?.displayName || "User"}
                                    title={user?.displayName || "User"} />
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline rounded-full hover:bg-purple-600">Log Out</button>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default Navbar;