import { Link, useNavigate } from 'react-router-dom';
import './Register.css'
import axios from 'axios';

import { useEffect, useState } from 'react';

import { API_BASE_URL } from '../../src/config'
// import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux';
// import Loading from '../components/Loading.Component';
import FrontPage from '../Components/FrontPage';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Image from '../images/chat_5946074.png';
import Swal from 'sweetalert2';
import Loading from '../Components/LoadingComponent';

function Register() {
// Defining states
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Function to handle login submission
    const register = (event) => {
        event.preventDefault();
        setLoading(true);
        const requestData = {Name:fullName,UserName:userName, Email:email, Password:password}
        axios.post(`${API_BASE_URL}/auth/register`, requestData)
            .then((result) => {
                if (result.status == 200) {
                    setLoading(false);
                    console.log(result);
                    Swal.fire({
                        icon:'success',
                        title:"User Registered Successfully"
                    })
                    setfullName('');
                    setEmail('');
                    setUserName('');
                    setPassword('');
                    // Navigate to the home page after successful Register
                    navigate('/');
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                // Display error message if login fails
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
    }

    useEffect(() => {
        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    // Display loading component while data is being fetched
    if (isLoading) {
        return <Loading />;
    }

    return (
        // Structure for the webpage
        <>
        <div className="container login-container mb-4">
            <div className="row g-0">
                <div className="col-md-7  col-sm-12 d-flex flex-column justify-content-center align-items-center">
                    <img alt="social" className='border border-5 rounded  socialDesktop' style={{ height: '100%',width:"100%" }} src={'https://img.freepik.com/free-vector/abstract-twitter-icon_1055-2761.jpg?t=st=1714760003~exp=1714763603~hmac=d366f65f567cee836e968aae9f51934b005dab9205671956ce8c8270b364af85&w=900'} />
                    <img alt="social" className='border border-5 rounded  socialMobile' style={{ height: '100%',width:"100%" }} src={'https://img.freepik.com/free-vector/abstract-twitter-icon_1055-2761.jpg?t=st=1714760003~exp=1714763603~hmac=d366f65f567cee836e968aae9f51934b005dab9205671956ce8c8270b364af85&w=900'} />
                </div>
                <div className="col-md-5 col-sm-12">
                    <div className="card shadow">
                        {loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
                        <div className="card-body  px-5">
                            <h4 className="card-title fw-bold text-center mt-3 fw-bold">Register</h4>
                            <form onSubmit={(e) => register(e)}>
                                <input type="text" value={fullName} onChange={(ev) => setfullName(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Enter Full Name' />
                                <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Enter Email' />
                                <input type="text" value={userName} onChange={(ev) => setUserName(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Enter UserName' />
                                <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Password' />
                                <div className='mt-3 d-grid'>
                                    <button type='submit' className="custom-btn custom-btn-blue">Register</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                    <button className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Already have an account?</span>
                                        <Link to="/" className='ms-1 text-info fw-bold'>Login</Link>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
        </>
    );
}

export default Register;
