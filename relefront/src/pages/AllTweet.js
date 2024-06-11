import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import Loading from '../Components/LoadingComponent'


const AllTweet = () => {
    // Defining states
    const [alltwet, setAlltwet] = useState([]);
    const [tweet, setTweet] = useState('');
    const [file, setFile] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const users = JSON.parse(localStorage.getItem('user'));

    // Function to like the user
    const like = async (tweetid) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tweet/${tweetid}/like/${users._id}`);
            alltweet()
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Already Liked"
            })
            console.log(error);
        }
    }
// Function to unlike the user
    const unlike = async (tweetid) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tweet/${tweetid}/unlike/${users._id}`);
            alltweet();
        } catch (error) {
            Swal.fire({
                icon: "info",
                title: "Already Unliked"
            })
            console.log(error);
        }
    }

    // Function to goto tweet page
    const gototweetpage = (id) => {
        navigate('/tweetdetail', { state: id });
    };
    // Function to go to other profile
    const gotootherprofile = (id) => {
        if (users._id != id) {
            navigate('/otherProfile', { state: id });
        }
    };
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    // Function to create tweet
    const addtweetData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("Content", tweet)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        const res = axios.post(`${API_BASE_URL}/uploadTweet/${users._id}`, formData, config);
        console.log("first", res);
        alltweet();
    }


    // Function to delete tweet
    const tweetdelete = async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/deleteTweet/${id}`, CONFIG_OBJ);
        if (response.status === 200) {
            alltweet();
            console.log("DEleted");
        }
    }
    // Function to fetch all tweets
    const alltweet = async () => {
        const response = await axios.get(`${API_BASE_URL}/tweets`, CONFIG_OBJ);
        if (response.status === 200) {
            setAlltwet(response.data.result)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred while getting all posts'
            });
        }

    }
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to clear user authentication data from local storage and dispatch a logout action
    const clearstore = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/");

    }

    // Function to handle user logout
    const logout = () => {
        clearstore();
    }

    useEffect(() => {
        alltweet();
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
        // WebPage Structure
        <div className='container'>
            <div className='row my-5 d-flex w-100'>
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
                        <div className='d-flex justify-content-between align-items-center'><NavLink className="text-decoration-none text-dark" to={'/home'}><i className="fa-solid fa-house px-2 py-2"></i>Home</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center  '><NavLink className="text-decoration-none text-dark" to={'/userProfile'}><i className="fa-solid fa-user px-2 py-2 "></i>Profile</NavLink></div>
                        <div className='d-flex justify-content-between  align-items-center'><NavLink to={'/'} className="text-decoration-none text-dark" onClick={() => logout()}><i className="fa-solid fa-right-from-bracket px-2 py-2"></i>Logout</NavLink></div>
                    </div>
                </div>
                <div className='col-md-10'>
                    <div className='row'>
                        <div className='col d-flex justify-content-between'>
                            <span className='mx-2 fw-bold fs-3'>Home</span>
                            <button data-toggle="modal" data-target="#TweetModal" type='button' className='mx-4 btn btn-primary text-light'>Tweet</button>
                        </div>
                    </div>
                    {/* Iterating through all the tweeet */}
                    {alltwet.map((data) => {
                        return (
                            <div className='col-12 my-2' >
                                <div className="card w-100 d-flex flex-column" >

                                    <div className='d-flex align-items-start'>
                                        RetweetedBy:
                                    {data.RetweetedBy.map((datas)=>{
                                        return(
                                                <p className='ms-2'>{datas.UserName}</p>
                                        )
                                    })}
                                    </div>
                                    <div className='w-100 d-flex flex-row align-content-center'>
                                        <img className='border border-3 border-dark tweet-pic img-fluid' alt="profile pic" src={data.TweetedBy.ProfilePicture} />
                                        <span className='pt-2 fw-bold ps-2' onClick={() => gotootherprofile(data.TweetedBy._id)}>{data.TweetedBy.UserName}</span>
                                        <span className='pt-2 ps-2'>{moment(data.createdAt).format('DD/MM/YYYY HH:MM')}</span>
                                        {data.TweetedBy._id == users._id ?
                                            <span className='text-end w-100 pt-3 pe-2'><i onClick={() => tweetdelete(data._id)} className="fs-5 text-warning fa-solid fa-trash"></i></span> : ""
                                        }
                                    </div>
                                    <div onClick={() => gototweetpage(data._id)} className='d-flex mt-3 flex-column align-items-center justify-content-center ps-3'>
                                        <p className='fs-5' >{data.Content}</p>
                                        {data.Image != "None" && <img style={{ height: "300px", width: "60%" }} src={data.Image} alt='Tweet Image' />}
                                    </div>
                                    <div className='w-100 d-flex align-items-start'>
                                        <span onClick={() => like(data._id)}><i className="px-3 text-danger fa-regular fa-heart"></i>{data.Likes.length}</span>
                                        <span onClick={() => unlike(data._id)}><i className="px-3 fa-solid fa-heart-crack"></i></span>
                                        <span><i className="px-3 fa-regular text-primary fa-comment"></i>{data.Replies.length}</span>
                                        <span><i className="px-3 text-success fa-solid fa-retweet"></i>{data.RetweetedBy.length}</span>
                                        <span data-toggle="modal" data-target="#replyModal"><i className="px-3 fa-solid fa-reply"></i>{data.Replies.length}</span>
                                    </div>
                                </div>
                            </div>)
                    })}
                </div>
            </div>
            {/* <!-- Modal --> */}
            {/* Modal to create tweet */}
            <div className="modal fade" id="TweetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Reply</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='col-12'>
                                <textarea className="form-control mb-3" value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="Let's Tweet" id="floatingTextarea"></textarea>
                                <input name="file" type="file" id="drop_zone" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Close</button>
                            <button type="button" onClick={addtweetData} className="btn btn-primary" data-dismiss="modal">Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllTweet
