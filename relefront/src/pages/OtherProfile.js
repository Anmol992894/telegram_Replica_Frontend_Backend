import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './UserProfile.css'
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { NavLink, json, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import Loading from '../Components/LoadingComponent';
const OtherProfile = () => {
    // Defining States
    const users = JSON.parse(localStorage.getItem('user'));
    const [data, setData] = useState([]);
    const location = useLocation();
    const id = location.state;
    const [tweetdata, settweetdata] = useState([]);
    const [followerslength, setFollowersLength] = useState();
    const [followinglength, setFollowingLength] = useState();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to clear user authentication data from local storage and dispatch a logout action
    const clearstore = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
    }

    // Function to handle user logout
    const logout = () => {
        clearstore();
        navigate("/");
    }
    // Function to go to detailed tweet page
    const gototweetpage = (id) => {
        navigate('/tweetdetail', { state: id });
    };
    // Function to go to others profile
    const gotootherprofile = (id) => {
        console.log(id);
        if (users._id != id) {
            navigate('/otherProfile', { state: id });
        }
    };

    // Function for like
    const like = async (tweetid) => {
        try {
            console.log("Bearer ", localStorage.getItem("token"));
            const response = await axios.put(`${API_BASE_URL}/tweet/${tweetid}/like/${users._id}`);
            usertweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Already Liked"
            })
            console.log(error);
        }
    }
    // Function for unlike
    const unlike = async (tweetid) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tweet/${tweetid}/unlike/${users._id}`);
            usertweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: error
            })
            console.log(error);
        }
    }

    // function to fetch user data
    const user = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${id}`, CONFIG_OBJ);
            if (response.status === 200) {
                setData(response.data.result);
                setFollowers(response.data.result.Followers);
                setFollowing(response.data.result.Following);
                setFollowersLength(response.data.result.Followers.length);
                setFollowingLength(response.data.result.Following.length);
                setIsFollowing(followers.includes(users._id));

            }
        } catch (error) {
            console.log(error);
        }
    }
    // Function to follow the user
    const handleFollow = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/user/${id}/follow/${users._id}`, CONFIG_OBJ);
            // // Send a request to the backend to follow the user
            console.log(isFollowing);
            setIsFollowing(true);
            user();
            // Update the following list in the state
            setFollowing([...following, id]);
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "You are following this user"
            })
            console.error('Error following user:', error);
        }
    };
    // Function to unfollow the user
    const handleUnfollow = async () => {
        try {
            // Send a request to the backend to unfollow the user
            const response = await axios.put(`${API_BASE_URL}/user/${id}/unfollow/${users._id}`, CONFIG_OBJ);
            setIsFollowing(false);
            user()
            // Update the following list in the state
            setFollowing(following.filter(id => id !== id));
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "You are not following this user"
            })
            console.error('Error unfollowing user:', error);
        }
    };
    // Function to fetch user tweet
    const usertweet = async () => {
        const response = await axios.get(`${API_BASE_URL}/usertweets/${id}`, CONFIG_OBJ);
        if (response.status === 200) {
            settweetdata(response.data.result);
        }

    }
    useEffect(() => {
        user();
        usertweet();
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
        // Webpage Structure
        <div className='container profile-container mb-5'>
            <div className='row d-flex'>
                <div className='col-md-2'>
                    <div style={{ position: "sticky", top: "0" }}>
                        <div className='d-flex align-items-start py-3 ps-3' ><i className="text-primary shadow fs-1 fa-brands fa-twitter"></i></div>
                        <div className='d-flex desktop mt-3 w-75 justify-content-between flex-column'>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house py-2 px-3"></i>Home</NavLink></div>
                            <div className='d-flex justify-content-between '><NavLink className='text-decoration-none text-dark' to={'/userProfile'}><i className="fa-solid fa-user py-2 px-3"></i>Profile</NavLink></div>
                            <div className='d-flex justify-content-between '><NavLink to={'/'} className='text-decoration-none text-dark' onClick={() => logout()}><i className="fa-solid fa-right-from-bracket py-2 px-3"></i>Logout</NavLink></div>
                        </div>
                    </div>

                    <div className='d-flex w-75 mobile justify-content-between'>
                        <div className='d-flex justify-content-between align-items-center'><NavLink className='text-decoration-none text-dark' to={'/home'}><i className="fa-solid fa-house px-2 py-2"></i>Home</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center  '><NavLink className='text-decoration-none text-dark' to={'/userProfile'}><i className="fa-solid fa-user px-2 py-2 "></i>Profile</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center'><NavLink className='text-decoration-none text-dark' to={'/'} onClick={() => logout()}><i className="fa-solid fa-right-from-bracket px-2 py-2"></i>Logout</NavLink></div>
                    </div>
                    <div className='d-flex'>
                        <p></p>
                    </div>
                </div>
                <div className='col-md-10'>
                    <div className='row grad'>
                        <div className='mt-5 pt-5 col-md-4 col-md-6 w-100  d-flex align-items-center justify-content-between'>
                            <div className='ms-3'>
                                <img className='border border-3 border-dark profile-pic img-fluid' alt="profile pic" src={data.ProfilePicture} />
                            </div>
                            <div className='col-md-8 d-flex  justify-content-end '>
                                <button onClick={() => handleFollow(user.id)} type='button' style={{ height: "40px" }} className='btn btn-dark text-light'>Follow</button>
                                <button onClick={() => handleUnfollow(user.id)} type='button' style={{ height: "40px" }} className='btn btn-dark  text-light'>Unfollow</button>

                            </div>
                        </div>
                    </div>
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
                    <div className='row d-flex w-100'>
                        {/* Iterating throught the other user tweets */}
                        {tweetdata.map((datar) => {
                            return (
                                <div className='col-12 my-2' >
                                    <div className="card w-100 d-flex flex-column" >
                                        <div className='w-100 d-flex flex-row align-content-center'>
                                            <img className='border border-3 border-dark tweet-pic img-fluid' alt="profile pic" src={data.ProfilePicture} />
                                            <span className='pt-2 fw-bold ps-2' onClick={() => gotootherprofile(datar.TweetedBy._id)}>{data.UserName}</span>
                                            <span className='pt-2 ps-2'>{moment(datar.createdAt).format('DD/MM/YYYY HH:MM')}</span>
                                        </div>
                                        <div onClick={() => gototweetpage(datar._id)} className='d-flex mt-3 flex-column align-items-center justify-content-center ps-3'>
                                            <p className='fs-5' >{datar.Content}</p>
                                        </div>
                                        <div className='w-100 d-flex align-items-start'>
                                            <span onClick={() => like()}><i className="px-3 text-danger fa-regular fa-heart"></i>{datar.Likes.length}</span>
                                            <span onClick={() => unlike()}><i class="px-3 fa-solid fa-heart-crack"></i></span>
                                            <span><i className="px-3 fa-regular text-primary fa-comment"></i>{datar.Replies.length}</span>
                                            <span><i className="px-3 text-success fa-solid fa-retweet"></i>{datar.RetweetedBy.length}</span>
                                            <span data-toggle="modal" data-target="#replyModal"><i class="px-3 fa-solid fa-reply"></i>{datar.Replies.length}</span>
                                        </div>
                                    </div>
                                </div>)
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default OtherProfile
