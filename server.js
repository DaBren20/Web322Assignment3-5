const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expbs = require('express-handlebars');
const path = require("path");
const passport = require('passport');
var db = mongoose.connection;
const bodyParser = require('body-parser');
const flash = require('express-flash');
const clientSession = require('client-sessions');
const session = require('express-session');
const cart = require('connect-mongo')(session);

//load the environment variable file
require('dotenv').config({
    path:"./config/keys.env"
});

//let urlencoded = bodyParser.urlencoded({ urlencoded: false});
app.engine('handlebars', expbs( { defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
//app.use(urlencoded);
app.use(express.static(path.join(__dirname, 'public')));

//Data Parsing
app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

const userRoutes = require('./routes/User');

app.use('/user', userRoutes);

app.use((req,res,next) => {
 
    if(req.query.method=="PUT")
    {
        req.method="PUT"
    }

    else if(req.query.method=="DELETE")
    {
        req.method="DELETE"
    }

    next();
});

app.use(session({
    
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    store: new cart({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use((req,res,next) => {

    res.locals.user = req.session.user;
    res.locals.session = req.session;
    next();
});

//load controllers
const homecontroller = require("./controllers/home");
const signupcontroller = require("./controllers/signup");
const mealscontroller = require("./controllers/meals");
const logincontroller = require("./controllers/login");
const splashcontroller = require("./controllers/splash");
const signincontroller = require("./controllers/signedin");
const logoutcontroller = require("./controllers/logout");
const admincontroller = require("./controllers/admin");
const updatecontroller = require("./controllers/update");
const shoppingCartController = require("./controllers/shoppingCart");
const editcontroller = require("./controllers/edit");


//mapping 
app.use("/", homecontroller);
app.use("/meals", mealscontroller);
app.use("/signup", signupcontroller);
app.use("/login", logincontroller);
app.use("/splash", splashcontroller);
app.use("/signedin", signincontroller);
app.use("/logout", logoutcontroller);
app.use("/admin", admincontroller);
app.use("/update", updatecontroller);
app.use("/shoppingCart", shoppingCartController);
app.use("/edit", editcontroller);

app.post('/login', (req,res) => {

    const error1 = [];
    const error2 = [];

    if(req.body.email == "") {
        error1.push("This field is required.");
    }

    if(req.body.password == "") {
        error2.push("This field is required");
    }

    //This is if the user failed validation
    if(error1.length > 0) {
        res.render('login', { 
            title: 'Login',
            errorMessages: error1 
        });
        return;
    }

    //There are no errors
    else {
        res.redirect("/");
    }

    if(error2.length > 0) {
        res.render('login', { 
            title: 'Login',
            errorMessages2: error2
        });
        return;
    }

    //There are no errors
    else {
        res.redirect("/");
    }
});


//MongoDB connection
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

//promise was resolved
.then(()=>{
    console.log(`Connection to ${db.host} is successful`)
})
.catch((err)=> console.log(`Error occured : ${err}`)
)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Express http server listening on: ", PORT);
});