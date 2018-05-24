var connection = require('./../config');
var bcrypt = require('bcrypt');
module.exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   var check_query= connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
        if(results.length >0){
            bcrypt.compare(password, results[0].password, function(err, ress) {
                if(!ress){
                    /*res.json({
                      status:false,                  
                      message:"Email and password does not match"
                    }); */
					req.session.error = 'Incorrect username or password';
                     res.redirect('/');
                }else{   
					 req.session.user_id =results[0].id;
					 req.session.role =results[0].role;
					res.redirect('/dashboard');
					
				
                }
            });         
        }
        else{
		       req.session.error = 'Email does not exits';
               res.redirect('/');
        }
      }
    });
	

}




