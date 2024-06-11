import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import axios from 'axios';

import { useEffect, useState } from 'react';

import { API_BASE_URL } from '../../src/config'
// import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux';
// import Loading from '../components/Loading.Component';
import FrontPage from '../Components/FrontPage';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Image from '../images/chat_5946074.png';
import Swal from 'sweetalert2';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logedin=()=>{
        toast.success("User Logged in!",{
        position: toast.POSITION.TOP_RIGHT,
    })};

    // Function to handle login submission
    const login = (event) => {
        event.preventDefault();
        setLoading(true);
        const requestData = {Email:email, Password:password }
        axios.post(`${API_BASE_URL}/auth/login`, requestData)
            .then((result) => {
                console.log(result);
                if (result.status == 200) {
                    setLoading(false);
                    // Store token and user data in local storage
                    localStorage.setItem("token", result.data.result.Token);
                    localStorage.setItem('user', JSON.stringify(result.data.result.UserInfo));
                    // Dispatch login success action
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result });
                    setLoading(false);
                    console.log(result);
                    Swal.fire({
                        icon:'success',
                        title:"Successfully loged In"
                    })
                    
                    setEmail('');
                    setPassword('');
                    // Navigate to the home page after successful login
                    navigate('/home');
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
    const user = useSelector(state => state.userReducer);
    console.log(user);
    useEffect(() => {
        // Simulate an API call
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
 

    // Display loading component while data is being fetched
    if (isLoading) {
        return <FrontPage />;
    }

    return (
        <>
        <div className="container login-container mb-4">
            <div className="row g-0">
                <div className="col-md-7  col-sm-12 d-flex flex-column justify-content-top align-items-top">
                    <img alt="social" className='border border-5 rounded  socialDesktop' style={{ height: '78%',width:"100%" }} src={'https://img.freepik.com/free-vector/abstract-twitter-icon_1055-2761.jpg?t=st=1714760003~exp=1714763603~hmac=d366f65f567cee836e968aae9f51934b005dab9205671956ce8c8270b364af85&w=900'} />
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
                            <h4 className="card-title fw-bold text-center mt-3 fw-bold">Login</h4>
                            <form onSubmit={(e) => login(e)}>
                                <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Enter Email' />
                                <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Password' />
                                <div className='mt-3 d-grid'>
                                    <button type='submit' className="custom-btn custom-btn-blue">Log In</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                    <button className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Don't have an account?</span>
                                        <Link to="/register" className='ms-1 text-info fw-bold'>Register</Link>
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

export default Login;
