import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './UserProfile.css'
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { NavLink, json, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import Loading from '../Components/LoadingComponent';
const UserProfile = () => {
    // Defining States 
    const users = JSON.parse(localStorage.getItem('user'));
    const [data, setData] = useState([]);
    const [tweetdata, settweetdata] = useState([]);
    const [followerslength, setFollowersLength] = useState();
    const [followinglength, setFollowingLength] = useState();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState();
    const [file, setFile] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);



    // Function to clear user authentication data from local storage and dispatch a logout action
    const clearstore = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
    }

    // Function to handle user logout
    const logout = () => {
        navigate('/register');
        clearstore();
    }
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    // Function to edit user

    const editUser = async () => {
        const request = { Name: name, Location: location, DOB: date };
        const response = await axios.put(`${API_BASE_URL}/userEdit/${users._id}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            user();
        }
        else {
            console.log("data");
        }
    }


    // function to delete tweet
    const tweetdelete = async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/deleteTweet/${id}`, CONFIG_OBJ);
        if (response.status === 200) {
            usertweet();
            console.log("DEleted");
        }
    }
    // Function to fetch user
    const user = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${users._id}`);
            if (response.status === 200) {
                setData(response.data.result);
                setFollowersLength(response.data.result.Followers.length);
                setFollowingLength(response.data.result.Following.length);
            }
        } catch (error) {
            console.log(error);
        }
    }
    // Function to fetch user tweet
    const usertweet = async () => {
        const response = await axios.get(`${API_BASE_URL}/usertweets/${users._id}`, CONFIG_OBJ);
        if (response.status === 200) {
            settweetdata(response.data.result);
        }

    }

    // Function to upload Profile picture
    const adduserData= async (e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append("photo",file);
        const config={
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
        const res=axios.post(`${API_BASE_URL}/uploadProfile/${users._id}`,formData,config)
        .then((data)=>{
            if (data){
                Swal.fire({
                    icon:"info",
                    title:"Image uploaded"
                })
            }
        })
        .catch((error)=>{
            console.log(error);
        })
        user()
    }


    useEffect(() => {
        usertweet();
        user();
    }, [])
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
        // Structure of the webpage
        <div className='container profile-container mb-5'>
            <div className='row d-flex'>
                <div className='col-md-2'>
                    <div style={{ position: "sticky", top: "0" }}>
                        <div className='d-flex align-items-start py-3 ps-3' ><i className="text-primary shadow fs-1 fa-brands fa-twitter"></i></div>
                        <div className='d-flex desktop mt-3 w-75 justify-content-between flex-column'>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house py-2 px-3"></i>Home</NavLink></div>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/userProfile'}><i className="fa-solid fa-user py-2 px-3"></i>Profile</NavLink></div>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/'} onClick={() => logout()}><i className="fa-solid fa-right-from-bracket py-2 px-3"></i>Logout</NavLink></div>
                        </div>
                    </div>

                    <div className='d-flex w-75 mobile justify-content-between'>
                        <div className='d-flex justify-content-between align-items-center'><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house px-2 py-2"></i>Home</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center  '><NavLink className='text-decoration-none text-dark' to={'/userProfile'}><i className="fa-solid fa-user px-2 py-2 "></i>Profile</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center'><NavLink className='text-decoration-none text-dark' to={'/'} onClick={() => logout()}><i className="fa-solid fa-right-from-bracket px-2 py-2"></i>Logout</NavLink></div>
                    </div>
                </div>
                <div className='col-md-10'>
                    <div className='row grad'>
                        <div className='mt-5 pt-5 col-md-4 col-md-6 w-100  d-flex align-items-center justify-content-between'>
                            <div className='ms-3'>
                                <img className='border border-3 border-dark profile-pic img-fluid' alt="profile pic" src={data.ProfilePicture} />

                            </div>
                            {/* Button section for editing */}
                            <div className='col-md-8 d-flex  justify-content-end '>
                                <button data-toggle="modal" data-target="#ProfileModal" type='button' style={{ height: "40px" }} className=' btn btn-outline-primary border border-3 border-primary  text-primary'>Upload Profile</button>
                                <button data-toggle="modal" data-target="#EditModal" type='button' style={{ height: "40px" }} className='btn btn-outline-dark border border-3 border-dark  text-dark'>Edit</button>
                            </div>
                        </div>
                    </div>
                    {/* User detail sectiion */}
                    <div className='row'>
                        <div className='col-12 mt-3 ms-4 d-flex flex-column align-items-start'>
                            <p>{data.Name}</p>
                            <p className=''>{data.UserName}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 ms-3 d-flex align-items-start'>
                            <span><i className="px-2 fa-solid fa-cake-candles"></i>{moment(data.DOB).format('DD/MM/YYYY')}</span>
                            <span className='ps-3'><i className="px-2 fa-solid fa-map-location-dot"></i>{data.Location}</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 my-2 ms-3 d-flex align-items-start'>
                            <span><i className="px-2 fa-solid fa-calendar-days"></i>Joined: {moment(data.createdAt).format('DD/MM/YYYY')}</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 my-2 ms-3 d-flex align-items-start'>
                            <span className='fw-bold ps-2'>{followerslength} followers</span>
                            <span className='fw-bold ps-2'>{followinglength} following</span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 mt-4'>
                            <span className='fw-bold'>Tweets And Replies</span>
                        </div>
                    </div>
                    <hr />
                    {/* User tweet fetch section */}
                    <div className='row d-flex w-100'>
                        {tweetdata.map((data) => {
                            return (
                                <div className='col-12 my-2' >
                                    <div className="card w-100 d-flex flex-column" >
                                        <div className='w-100 d-flex flex-row align-content-center'>
                                            <img className='border border-3 border-dark tweet-pic img-fluid' alt="profile pic" src="https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdpbnRlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" />
                                            <span className='pt-2 fw-bold ps-2'>{data.UserName}</span>
                                            <span className='pt-2 ps-2'>{moment(data.createdAt).format('DD/MM/YYYY HH:MM')}</span>
                                            <span className='text-end w-100 pt-3 pe-2'><i onClick={() => tweetdelete(data._id)} class="fs-5 text-warning fa-solid fa-trash"></i></span>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <p>{data.Content}</p>
                                        </div>
                                        <div className='w-100 d-flex align-items-start'>
                                            <span><i className="px-3 text-danger fa-regular fa-heart"></i>{data.Likes.length}</span>
                                            <span><i className="px-3 fa-regular text-primary fa-comment"></i>{data.Replies.length}</span>
                                            <span><i className="px-3 text-success fa-solid fa-retweet"></i>{data.RetweetedBy.length}</span>
                                        </div>
                                    </div>
                                </div>)
                        })}
                    </div>

                </div>
            </div>

            {/* <!-- Modal --> */}
            {/* Modal for editing user details */}
            <div className="modal fade" id="EditModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='col-12'>
                                <input type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} className='my-3 form-control' />
                                <input type='text' placeholder='Enter Locationn' value={location} onChange={(e) => setLocation(e.target.value)} className='my-3 form-control' />
                                <input type='date' placeholder='Pass DOB' value={date} onChange={(e) => setDate(e.target.value)} className='my-3 form-control' />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
                            <button type="button" onClick={() => editUser()} className="btn btn-primary" data-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for uploading profile picture */}
            <div className="modal fade" id="ProfileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='col-12'>
                                <input name="file" type="file" id="drop_zone" onChange={(e)=>setFile(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
                            <button onClick={adduserData} type="button" className="btn btn-primary" data-dismiss="modal">Upload</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserProfile
