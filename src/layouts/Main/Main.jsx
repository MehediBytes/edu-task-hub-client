import { Outlet, useLocation } from "react-router";
import Navbar from "../../pages/shared/Navbar/Navbar";
import Footer from "../../pages/shared/Footer/Footer";

const Main = () => {
    const location = useLocation();
    const noHeaderFooter = location.pathname.includes('login')
    return (
        <div>
            {/* Nvabar section */}
            {noHeaderFooter ||
                <section>
                    <Navbar></Navbar>
                </section>
            }
            {/* outlets */}
            {noHeaderFooter ?
                <section className="min-h-screen">
                    <Outlet></Outlet>
                </section> :
                <section className="min-h-screen my-5">
                    <Outlet></Outlet>
                </section>
            }
            {/* Footer section */}
            {noHeaderFooter ||
                <section>
                    <Footer></Footer>
                </section>
            }
        </div>
    );
};

export default Main;