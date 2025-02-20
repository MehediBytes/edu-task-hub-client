import loginAnime from '../../assets/edu-login.png';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    return (
        <div className="container mx-auto px-5">
            <div className='md:flex md:justify-center md:items-center md:gap-10'>
                <div>
                    <img src={loginAnime} alt="login wellcome message"
                        className='w-96 h-96 object-cover' />
                </div>
                <div>
                    <h3 className='text-2xl font-semibold mb-5'>Easy Sign Up With Google</h3>
                    <button
                        className="btn btn-outline rounded-md flex items-center gap-2 justify-center"
                    >
                        <FcGoogle />
                        <p className='text-purple-600'>Google Sign Up</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;