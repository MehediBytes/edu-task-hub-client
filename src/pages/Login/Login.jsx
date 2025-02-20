import { motion } from "framer-motion";
import loginAnime from "../../assets/edu-login.png";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../hooks/UseAxiosPublic";

const Login = () => {

    const { googleSignIn, setUser } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                setUser(result.user);
                if (result.user.email) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Loged in with google successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
                navigate("/")
                const userInfo = {
                    name: result.user?.displayName,
                    email: result.user?.email,
                    photo: result.user?.photoURL
                }
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        if (res.data?.email) {
                            navigate("/");
                        }
                    })
            })
    }

    return (
        <div className="container mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pt-5 text-center">
                <h1 className="text-2xl text-purple-600 font-semibold">Wellcome to Edu-Task-Hub. Please Sign up for getting started.</h1>
            </motion.div>
            <motion.div
                className="md:flex md:justify-center md:items-center md:gap-20 pt-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <img src={loginAnime} alt="login welcome message" className="w-96 h-96 object-cover" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h3 className="text-2xl font-semibold mb-5">Easy Sign Up With Google</h3>
                    <motion.button
                        onClick={handleGoogleSignIn}
                        className="btn btn-outline rounded-md flex items-center gap-2 justify-center px-5 py-2 border border-purple-600 text-purple-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FcGoogle className="text-2xl" />
                        <p>Google Sign Up</p>
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
