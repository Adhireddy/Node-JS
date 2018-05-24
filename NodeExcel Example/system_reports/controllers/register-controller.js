var connection = require('./../config');
var bcrypt = require('bcrypt');

module.exports.register=function(req,res){
var hash = bcrypt.hashSync(req.body.password, 10);
 /*bcrypt.hash(req.body.password, 10, function(err, hash) {
    // Store hash password in your Database.
}); */
    var today = new Date();
    var users={
        "name":req.body.name,
        "email":req.body.email,
        "password":hash,
		"role":req.body.user_role,
        "created_at":today,
        "updated_at":today
    }
	
   var lastquery= connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {

                 res.redirect('/dashboard');
      }else{
          res.redirect('/dashboard');
      }
    });
	
}