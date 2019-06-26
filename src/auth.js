const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
  User.findOne({username:username}, (err, result, count) => {
    if(username.length<8 || password.length<8){
      errObj = {message: "USERNAME PASSWORD TOO SHORT"}
      errorCallback(errObj);
    }else{
    if(result){
      errObj = {message: "USERNAME ALREADY EXISTS"}
      errorCallback(errObj);
    }else{

      bcrypt.hash(password, 10, function(err, hash) {

        new User({
          username: username,
          email: email,
          password: hash,
        }).save(function(err, user, count){
          if(err){
            errObj = {message:"DOCUMENT SAVE ERROR"}
            errorCallback(errObj);
          }else{
            successCallback(user);
          }
        });
      });

    }
  }
  });








}

function login(username, password, errorCallback, successCallback) {
  User.findOne({username: username}, (err, user, count) => {
    if (!err && user) {
         // compare with form password
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
      // regenerate session if passwordMatch is true
        if(passwordMatch){
          successCallback(user);
        }else{
          //if not return error message
          errObj = {message:"PASSWORDS DO NOT MATCH"};
          errorCallback(errObj);
        }
      });
    }
    else{
      errObj = {message: "USER NOT FOUND"}
      errorCallback(errObj);
    }

  });

}





function startAuthenticatedSession(req, user, cb) {
  req.session.regenerate((err) => {
    //if not error log user
    if (!err) {
      req.session.user = user;
      req.session.username = user.username;
      req.session.email = user.email;

      cb(err)
    } else {
  	// log out errorcall callback with error
      cb(err)
    }
  });

}
//export functions
module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
