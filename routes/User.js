const express = require('express')
const router = express.Router();
const bcrypt= require("bcryptjs");
const path = require("path");

const User = require("../models/data-registration");

router.get("/signup", (req,res) => {
    res.render("/signup");
});

router.post('/signup', (req,res)=> {
    const newUser = {
        firstName : req.body.firstname,
        lastName : req.body.lastname,
        email : req.body.email,
        password : req.body.password
    }

    const user = new User(newUser);
    const error = [];
    user.save()
    .then(()=>{
        console.log(`${user}`);

        res.redirect("/splash");
    })
    .catch(err=> {
        console.log('Error.')
        error.push("This email is already in use");
    })
});

router.get("/login",(req,res)=>
{
    res.render("/login");
});

//Route to process user's request and data when user submits login form
router.post("/login",(req,res)=>
{

    const errors= [];
    const formData = {
        email : req.body.email,
        password : req.body.password
    }

    User.findOne({email:formData.email})
    .then(user=>{

        //This means that there was no matching email in the database
        if(user==null)
        {
            errors.push("Sorry your email was not found");
            res.render("User/login",{
                errors: errors
            })
        }

        //This reprsents tha the email exists
        else
        {
            bcrypt.compare(formData.password,user.password)
            .then(isMatched=>{

                if(isMatched==true)
                {
                    //It means that the user is authenticated 

                    //Create session 
                    req.session.userInfo=user;
                    res.redirect("/user/profile")
                }

                else
                {
                    errors.push("Sorry, your password does not match");
                    res.render("User/login",{
                        errors:errors
                    })
                }

            })

            .catch(err=>console.log(`Error :${err}`));
        }
    })
    .catch(err=> console.log(`Something occured ${err}`));

});

module.exports = router;