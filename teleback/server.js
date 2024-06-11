// importing dependencies
const express=require('express');
const PORT=4000;
const cors=require('cors')
const app=express();
const moongoose=require('mongoose');
const {MONGOBD_URL}=require('./config');

// Building connections
moongoose.connect(MONGOBD_URL);

// Establishing connections
moongoose.connection.on('connected', ()=>{
    console.log('DB Connected');
})

moongoose.connection.on('error',()=>{
    console.log("Some error occured while connecting to DB");
})

// importing models
require('./models/user_model');
require('./models/tweet_model');

app.use(cors());
app.use(express.json());

// importing routes
app.use(require('./routes/user_route'))
app.use(require('./routes/file_route'))
app.use(require('./routes/tweet_route'))


app.listen(PORT,()=>{
    console.log("Connected to the server");
})