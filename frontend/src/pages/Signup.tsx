import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";
import axios from "axios";

function Signup() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const register = async () => {

        if (loading) return;

        if (!name || !email || !password || !confirm) {
            toast.error("All fields required");
            return;
        }

        if (confirm.trim() !== password.trim()) {
            toast.error("Password must match");
            return;
        }

        if (!email.includes('@gmail.com') && !email.includes('@outlook.com')) {
            toast.error("Enter a valid personal email");
            return;
        }

        if (!/[0-9]/.test(password)) {
            toast.error("Password must contain a number");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain an uppercase alphabet");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                name: name.trim(), email: email.trim(), password: password.trim()
            });

            if (res.status === 200) {
                navigate('/auth/login')
            }
        } catch (err: any) {
            if (err && err.response.data.message) {
                toast.error(err.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={`w-full h-screen flex flex-col justify-start items-center relative bg-linear-to-b from-zinc-800 to-zinc-950 overflow-hidden overflow-y-auto hide-scrollbar`}>

                <h1 className={`w-full mt-5 z-20 text-center px-5 text-5xl md:text-7xl pt-5 lg:pt-0 pb-3 font-bold bg-linear-to-b from-white via-gray-400 to-gray-700 bg-clip-text text-transparent`}>Register</h1>
                <p className={`w-full md:w-[70%] z-20 text-center text-white text-sm md:text-lg px-5`}></p>

                <div className={`w-125 h-125 bg-linear-to-br from-gray-500 to-black rounded-full opacity-30 absolute -left-1/2 -bottom-[20%] z-10`} />
                <div className={`w-125 h-125 bg-linear-to-br from-gray-600 to-black rounded-full opacity-15 absolute -right-1/2 -bottom-[20%] z-10`} />

                <div className={`w-[90%] z-20 py-4 px-3 h-auto md:w-[60%] lg:w-[40%] flex flex-col justify-start items-center border border-zinc-600 mt-10`}>
                    <p className={`w-full text-start text-white text-lg font-light`}>Enter name</p>
                    <input onChange={(e) => setName(e.target.value)} type="text" className={`w-full bg-white text-black py-2 px-3 mt-2 outline-none mb-3`} placeholder="John Doe" />

                    <p className={`w-full text-start text-white text-lg font-light`}>Enter email</p>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full bg-white text-black py-2 px-3 mt-2 outline-none mb-3`} placeholder="doejohn@mail.com" />

                    <div className={`w-full relative flex flex-col justify-start items-center`}>
                        <p className={`w-full text-start text-white text-lg font-light`}>Enter password</p>
                        <input onChange={(e) => setPassword(e.target.value)} type={passwordVisible ? "text" : "password"} className={`w-full bg-white text-black py-2 px-3 mt-2 outline-none mb-3`} placeholder="**********" />
                        <span onClick={() => setPasswordVisible(!passwordVisible)} className={`w-auto absolute top-[55%] text-gray-400 right-4 cursor-pointer`}>{passwordVisible ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>

                    <div className={`w-full relative flex flex-col justify-start items-center`}>
                        <p className={`w-full text-start text-white text-lg font-light`}>Confirm password</p>
                        <input onChange={(e) => setConfirm(e.target.value)} type={passwordVisible ? "text" : "password"} className={`w-full bg-white text-black py-2 px-3 mt-2 outline-none mb-3`} placeholder="**********" />
                        <span onClick={() => setPasswordVisible(!passwordVisible)} className={`w-auto absolute top-[55%] text-gray-400 right-4 cursor-pointer`}>{passwordVisible ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>

                    <p onClick={register} className={`w-full mt-3 bg-white text-black text-center py-2 active:opacity-85 duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-2`}>Submit <span className={`loading loading-spinner loading-sm ${loading ? "block" : "hidden"}`}></span></p>
                </div>

                <p className={`text-white font-light mt-7 w-full text-sm text-center`}>Already have an account ?</p>
                <Link to='/auth/login' className={`text-white font-semibold text-lg pb-2 border-b cursor-pointer w-auto px-3 text-center`}>Login here</Link>

            </div>
        </>
    )
}

export default Signup
