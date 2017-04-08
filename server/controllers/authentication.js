var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  User.findOne({email: req.body.email}, (err, result) => {
    if(result){
      res.status(400).json({
        message:'User already exsits'
      });
      return;
    }
    var user = new User();

    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function(err) {
      var token;
      token = user.generateJWT();
      res.status(200);
      res.json({
        "token" : token
      });
    });
  });
};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJWT();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};

