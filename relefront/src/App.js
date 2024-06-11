import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import Login from './pages/Login';
import Loading from './Components/LoadingComponent';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import TweetDetailsPage from './pages/TweetdetailPage';
import OtherProfile from './pages/OtherProfile';
import AllTweet from './pages/AllTweet';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login/>}></Route>
        <Route exact path='/register' element={<Register/>}></Route>
        <Route exact path='/tweetdetail' element={<TweetDetailsPage/>}></Route>
        <Route exact path='/home' element={<AllTweet/>}></Route>
        <Route exact path='/userProfile' element={<UserProfile/>}></Route>
        <Route exact path='/otherProfile' element={<OtherProfile/>}></Route>
        <Route exact path='/front' element={<FrontPage/>}></Route>
        <Route exact path='*' element={<Loading/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
