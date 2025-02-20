import { Link } from "react-router";


const ErrorPage = () => {
    return (
        <div className="text-center space-y-3 py-10 min-h-screen container mx-auto">
            <h1 className="text-6xl font-bold text-red-500 mb-5">OPPS!</h1>
            <p className="text-xl font-bold">404 - Page Not Found</p>
            <p className="pb-3 text-md font-medium text-gray-500">The page you are looking for might have been removed <br />had its name changed or is temporarily unavailable.</p>
            <Link to='/'>
                <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700">GO TO HOMEPAGE</button>
            </Link>
        </div>
    );
};

export default ErrorPage;