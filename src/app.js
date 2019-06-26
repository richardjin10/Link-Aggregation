//imports
const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();
const User = mongoose.model('User');
const Article = mongoose.model('Article');

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));


app.use((req, res, next) => {
    if(req.session.user!==undefined){
      //console.log(req.session.user, "hihihi");
      res.locals.user = req.session.user;
      next();
    }else{
      next();
    }
});

//route for default
app.get('/', (req, res) => {
  Article.find({}, function(err, article, count){
    res.render('index', {
      article:article,

    }, );
  });
});

//route to add a article
app.get('/article/add', (req, res) => {
  if(req.session.user===undefined){
    res.redirect('/');
  }else{
    res.render("article-add");
  }
});

app.post('/article/add', (req, res) => {
  new Article({
    userid: req.session.user.username,
    title: req.body.title,
    url: req.body.url,
    description:req.body.description,
  }).save(function(err, article, count){
    res.redirect('/');
  });


});



//route for when article is clicked
app.get('/article/:slug', (req, res) => {
  const slug = req.params.slug;
  Article.find({"slug":slug},function(err, result){
    if(result){

    res.render("article-detail",{
      article:result,
    });
  }


  });

});

//route to register a user
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {



  function success(newUser) {
  // start an authenticated session and redirect to another page
    function cb(err){
      res.locals.user = req.session.user;
      res.redirect('/');
    }
    auth.startAuthenticatedSession(req, newUser, cb);


  }

  function error(err){
    res.render('register', {
      message:err.message
    });
  }
  auth.register(req.body.username, req.body.email, req.body.password, error, success);

});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  function success(newUser){
    function cb(err){
      res.locals.user = req.session.user;
      res.redirect('/');
    }
    auth.startAuthenticatedSession(req, newUser, cb);
  }

  function error(err){
    res.render('login',{
      message:err.message,
    });
  }

  auth.login(username, password, error, success);


});

app.listen(3000);
