import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-purple-500 text-base-100 py-5">
            <div className="container mx-auto px-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                    {/* Column 1 */}
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Edu-Task-Hub</h2>
                        <p>
                            Manage your task easily
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                        <ul className="space-y-1">
                            <li><a href="/" className="hover:text-purple-800 transition">Home</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4 text-base-100">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-purple-800 transition text-2xl">
                                <FaFacebookF />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-purple-800 transition text-2xl">
                                <FaInstagram />
                            </a>
                            <a href="https://x.com/" target="_blank" rel="noreferrer" className=" hover:text-purple-800 transition text-2xl">
                                <FaXTwitter />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className=" hover:text-purple-800 transition text-2xl">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-base-100" />

                <div className="text-center">
                    <p className="text-base-100">
                        © {new Date().getFullYear()} Edu-Task-Hub. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
