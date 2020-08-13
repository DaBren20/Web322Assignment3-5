const express = require('express')
const router = express.Router();
const userModel = require('../models/data-registration');
const prodModel = require('../models/product-registration');
const addCart = require('../models/cart');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' } );
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Create Your Account' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});


router.get("/meals", (req,res)=> {
    
    prodModel.find({})
      .then((meals)=>{
        const mealShow = meals.map(meal=> {
            return {
                id: meal._id,
                mealName: meal.mealName,
                price: meal.price,
                description: meal.description,
                quantity: meal.quantity,
                //mealPackageType: meal.mealPackageType,
                topPackage: meal.topPackage
            }
        });

        res.render("meals", {
            
            data : mealShow
        });
    })
    .catch(err=>console.log(`Error when pulling from the database :${err}`));
    
});

router.get('/splash', (req, res) => {
    res.render('splash', { title: 'Thank You!' });
});

router.get('/signedin', (req, res) => {
    res.render('signedin', { title: 'signed in' });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Page'});
});

router.get('/update', (req, res) => {
    res.render('update', { title: 'Update' });
});

router.get('/edit', (req, res) => {
    prodModel.find({})
    .then((meals)=>{
      const mealShow = meals.map(meal => {
          return {
              id: meal._id,
              mealName: meal.mealName,
              price: meal.price,
              description: meal.description,
              category: meal.category,
              quantity: meal.quantity, 
              //mealPackageType: meal.,
              topPackage: meal.topPackage
          }
      });

      res.render("edit", {
          data : mealShow
      });
  })
  .catch(err=>console.log(`Error when pulling from the database :${err}`));
});

router.get('/shoppingCart', function(req, res, next) {
    if (!req.session.cart){
        return res.render('shoppingCart', {products: null});
    }
    var cart = new addCart(req.session.cart);
    res.render('shoppingCart', {products: cart.genArray(), totalPrice: cart.totalPrice});
});

router.get('/cart', (req, res) => {
    
    prodModel.find({})
    .then((meals)=>{
      const mealShow = meals.map(meal => {
          return {
              id: meal._id,
              mealName: meal.mealName,
              price: meal.price,
              description: meal.description,
              category: meal.category,
              quantity: meal.quantity, 
              //mealPackageType: meal.,
              topPackage: meal.topPackage
          }
      });

      res.render("cart", {
          data : mealShow
      });
  })
  .catch(err=>console.log(`Error when pulling from the database :${err}`));
})

var id = "";

router.put('/update/:id', (req, res) => {
    id = req.params.id;
    console.log(id);
    res.render('update');
});

router.put("/Cupdate",(req,res)=> {

    const meal = {
       mealName : req.body.mealName,
       price : req.body.price,
       description : req.body.description,
       category : req.body.category,
       quantity : req.body.quantity,
       topPackage : req.body.topPackage
    }

    prodModel.updateOne({_id:id}, meal)
    .then(()=>{
        res.render("update");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));


});

//signup
router.post('/signup', (req,res)=> {
    const newUser = {
        firstName : req.body.firstname,
        lastName : req.body.lastname,
        email : req.body.email,
        password : req.body.password
    }

    const user = new userModel(newUser);
    const error = [];
    user.save()
    .then(()=>{
        console.log(`${user}`);

        //res.redirect("/splash");
    })
    .catch(err=> {
        console.log('Error.')
        error.push("This email is already in use");
    })

    const { firstname, lastname, email, password } = req.body
        
    //console.log(req.body);
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      to: `${email}`,
      from: `bkpoliusprosper@myseneca.ca`,
      subject: 'Thank you for signing up!',
      html: `<strong>Thank you for signing up ${firstname} ${lastname}</br>
            Email: ${email}
            </strong>`,
    };
    
    //Asynchronous operation
    sgMail.send(msg)
    .then(()=> {
        res.redirect("/splash");
    })
    
    .catch(err => {
        console.log(`Error ${err}`);
    })

    const error1 = [];
    const error2 = [];
    const error3 = [];
    const error4 = [];
    const error5 = [];

    if(req.body.firstname == "") {
        error1.push("This field is required.");
    }

    if(req.body.lastname == "") {
        error2.push("This field is required");
    }

    if(req.body.email == "") {
        error3.push("This field is required.");
    }

    if(req.body.password == "") {
        error4.push("This field is required");
    }

    else {
        const match = req.body.password.match(/^.{5,12}$/);
        if(match == null) {
            error5.push("Password must be between 5 and 12 characters.");
        }
    }

    //This is if the user failed validation
    if(error1.length > 0) {
        res.render('signup', { 
            title: 'Create your account',
            errorMessages: error1 
        });
        return;
    }

    if(error2.length > 0) {
        res.render('signup', { 
            title: 'Create your account',
            errorMessages: error2
        });
        return;
    }

    if(error3.length > 0) {
        res.render('signup', { 
            title: 'Create your account',
            errorMessages: error3
        });
        return;
    }

    if(error4.length > 0) {
        res.render('signup', { 
            title: 'Create your account',
            errorMessages: error4
        });
        return;
    }
    
    if(error5.length > 0) {
        res.render('signup', { 
            title: 'Create your account',
            errorMessages: error5
        });
        return;
    }
  
});

//adding meals to database
router.post('/admin', (req, res) => {

    successMsg = [];

    const newProduct = {
        mealName : req.body.mealName,
        price : req.body.price,
        description : req.body.description,
        category : req.body.category,
        quantity : req.body.quantity,
        topPackage : req.body.topPackage,
        picture : req.body.picture
    }

    const product = new prodModel(newProduct);

    product.save()
    .then(() => {
        successMsg.push("Package successfully added");
        console.log(`${product}`);
        res.render('admin', {successMsg});
    })
    .catch(err => {
        console.log('Error');
    })
});

router.get("/update", (req, res) =>
{
    prodModel.find({})
    .then((meals)=>{
      const mealShow = meals.map(meal => {
          return {
              id: meal._id,
              mealName: meal.mealName,
              price: meal.price,
              description: meal.description,
              category : meal.category,
              //mealPackageType: meal.,
              topPackage: meal.topPackage
          }
      });

      res.render("update", {
          data : mealShow
      });
  })
  .catch(err=>console.log(`Error when pulling from the database :${err}`));
});

//login function
router.post('/login', function(req, res) {
    
        /*var email = req.body.email;
        var password = req.body.password;
        var loggedIn = [];*/

    userModel.findOne({email:req.body.email})
    .then(user=>{
        const errorMsg = [];

        if(user == null) {
            errorMsg.push("You must enter a valid Email/Password!");
            res.render('login', {errorMsg})
        }

        else {
            bcrypt.compare(req.body.password, user.password)
            .then(isMatch=>{
                

                if(isMatch) {
                        if(user.type == "Admin") {
                            req.session.user = user;
                            res.redirect("admin");
                        }
                        else {   
                            console.log(`User: ${user} is logged in`)
                            req.session.user = user;
                            res.redirect("signedin");
                        }
                }

                else {
                    errorMsg.push("Email/Password incorrect!");
                    res.render('/login', {err: errorMsg});
                }

            })
            .catch(err=>console.log(`Error ${errorMsg}`));
        }
    })
    .catch(err=>console.log(`Error ${errorMsg}`));

});

router.get('/AddCart/:id', (req,res) =>{
    var prodID = req.params.id;
    var cart = new addCart(req.session.cart ? req.session.cart : {});

    prodModel.findById(prodID, function(err, product) {
        if (err){
            console.log(`error ${err}`)
            res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/cart');
        
    });
});


router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
    console.log("Session destroyed!");
});

module.exports = router;