const express = require('express');
// const { domain } = require('process');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');
const app = express();

require('./middleware/prod')(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use("/", express.static(path.join(__dirname, "angular")));

mongoose.connect('mongodb+srv://ahpatel9:' + process.env.MONGO_ATLAS_PW + '@cluster0.ar3og.mongodb.net/Dummy?retryWrites=true&w=majority').then(() => console.log('successfully connected to mongoDb....')).catch(() => console.log('failed to connect to mongoDB!'));
// mongoose.connect('mongodb://localhost/Dummy').then(() => console.log('successfully connected to mongoDb....')).catch(() => console.log('failed to connect to mongoDB!'));
//we Got This Error:::
// Access to XMLHttpRequest at 'http://localhost:3000/api/posts' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
//Solution:::
// if we send request to our nodejs backed it is blocked because of CORS rule of browser,and rule is we cannot share data across two different domain(here localhost: 4200 and localhost:3000/api/posts). So Below we setting a header using middleware ,so that our frontend can access data from our backend

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-origin', "*"); //here we allow all domain to access our backend
    res.setHeader('Access-Control-Allow-Headers', "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next) => { //when request comming to route other then upper two then our angular app will load
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
