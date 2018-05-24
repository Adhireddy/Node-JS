var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var mysql = require('mysql');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressValidator());
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "excelnode"
	});
var session = require('express-session');
app.use(session( {
  secret: 'excelapp password',
  resave: true,
  saveUninitialized: false
}));
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
app.get('/',function(req,res){
var session_id=req.session.user_id;
if( (typeof (session_id) != 'undefined' && session_id != null) ) {

requestNews(function(err,data) {
			if (err) return next(err);
			var keys=[];
			var sendata=[];
			var savefile='';
			var table_name='';
			var resultdata=JSON.stringify(data);
			res.render("index.ejs", {user: req.session.role,supplies:data,myArray:keys,sendata:sendata,resultdata:resultdata,filename:savefile,table_name:table_name});

});
}
else
{

res.render('login.ejs',{ error: req.session.error });
}

});

//User Authentication Function

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

//After login
 app.get('/dashboard',checkAuth,function(req,res){
 requestNews(function(err, data,categories) {
					if (err) return next(err);
					var keys=[];
					var sendata=[];
					var savefile='';
					var table_name='';
					var resultdata=JSON.stringify(data);
				    res.render("index.ejs", {user: req.session.role,supplies:data,resultdata:resultdata,list_categories:categories,myArray:keys,sendata:sendata,filename:savefile,table_name:table_name});
				  });


	  });

//Displaying search box based on selection

app.get('/searchbox/:page',checkAuth,function(req,res){
var menuid=req.params.page;
var get_data = connection.query('SELECT DISTINCT table_id,table_name,field_name,caption_name,ct.category_name,menu_name FROM base_table bt  LEFT JOIN categories ct on ct.category_id=bt.category LEFT JOIN field_details fd on bt.id=fd.table_id where bt.id='+menuid+' and display_search=1', function(err, rows) {
					var field_data = connection.query('SELECT DISTINCT table_id,table_name,field_name,caption_name,ct.category_name,menu_name FROM base_table bt  LEFT JOIN categories ct on ct.category_id=bt.category LEFT JOIN field_details fd on bt.id=fd.table_id where bt.id='+menuid+'', function(err, field_data) {
			          res.render("textbox.ejs", {supplies:rows,field_data:field_data});
				  });
				 });
	  });

//Display search result

app.post('/searchdata',function(req,res){
 		var field_data=req.body.datarr;
		var tablename=req.body.tablename;
		var field_name=req.body.fieldarr;
	    var fieldarray = field_name.split(',');
		var dataarray = field_data.split(',');
		console.log(fieldarray);
		console.log(dataarray);
	var filters = [];

 dataarray.forEach((val, index) => {
   if(val)
    filters.push(`${fieldarray[index]} like '${val}%'`);
 });

var dataquery=connection.query(`select  *  from `  + tablename + ` where ${filters.join(" OR ")} `, function(err,result) {
										  jsondata=JSON.stringify(result);
								          res.send(jsondata);

                                 });

	  });

//Upload excel file and data

app.post('/upload',checkAuth, function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    }
					 var dataarry=[];
				   var t=result;
					 var data=t[0];
					 var keys = Object.keys(data);
        // In order to correct the faulty library 'xls-to-json-lc' result
					 var initialvalue=keys[0];
					 for(var i=0;i<keys.length -1;i++){
					    keys[i]=keys[i+1];
					 }
					 keys[keys.length -1]=initialvalue;
         //ends here
					var new_keys=[];
          new_keys = keys.map(word => word.replace(/[^A-Z0-9]/ig, "_"));

					var resultdata=[];
					for(var i in result){
        			resultdata.push(result[i]);
					}
							resultdata.forEach(function(e, i) {
						  // Iterate over the keys of object
						  Object.keys(e).forEach(function(key) {
							// Copy the value
							var val = e[key],
							  newKey = key.replace(/\s+/g, '_');
							// Remove key-value from object
							delete resultdata[i][key];
							// Add value with new key
							console.log("val= "+ val);
							resultdata[i][newKey] = val;
						  });
					});


						var sendata=JSON.stringify(resultdata);
						var filename = req.file.originalname.split('.');
						var savefile=filename[0];
						var table_name='tbl_'+savefile;
					    var select_query = connection.query('SELECT id,menu_name FROM base_table', function(err, rows) {
					    var resultdata=JSON.stringify(data);
					 res.render('index.ejs', {user: req.session.role, supplies:rows,myArray:new_keys,sendata:sendata,resultdata:resultdata,filename:savefile,table_name:table_name })
				});
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });

//Display Page on menu link click

app.get('/api/:page',checkAuth, function(req, res, next){

var menuid=req.params.page;

var get_data = connection.query('SELECT DISTINCT table_name,field_name,caption_name FROM base_table bt LEFT JOIN field_details fd on bt.id=fd.table_id where bt.id='+menuid+' and display_status=1', function(err, rows) {
                      var tbl_name = rows[0].table_name;
					  var field_name=[];
					  for (var i in rows) {
					          field_name.push(rows[i].field_name + ' as ' + '"' + rows[i].caption_name + '"');

							}

					  var select_data = connection.query('SELECT id,' +field_name+ ' FROM ' +tbl_name, function(err, exceldata,fields) {
								if (exceldata.length > 0) {

										    jsondata=JSON.stringify(exceldata);
										    res.send(jsondata);
										}
										else
										{
											 res.send('1');
										}

					  });
				});
});

//Display add new user form
app.get('/addnewuser',checkAuth, function(req, res, next){

	            res.render("adduser.ejs");
});

//Display add new category form

app.get('/addcategory',checkAuth, function(req, res, next){
	            res.render("add_category.ejs");
});

//Display add new data form

app.get('/addnewdata/:page', function(req, res, next){
var menuid=req.params.page;
var resultdata='';
  var select_query = connection.query('SELECT DISTINCT id,table_id,table_name,field_name,caption_name FROM base_table bt LEFT JOIN field_details fd on bt.id=fd.table_id where bt.id='+menuid, function(err, rows) {
         res.render("addnewdata.ejs", { supplies:rows,editdata:resultdata});

		});

});

//Editing data

app.post('/editdata', function(req, res, next){
var menuid=req.body.menu_id;
var rowid=req.body.rowid;
var select_query = connection.query('SELECT DISTINCT table_id,table_name,field_name,caption_name FROM base_table bt LEFT JOIN field_details fd on bt.id=fd.table_id where bt.id='+menuid, function(err, rows) {
		             var tbl_name = rows[0].table_name;
					  var field_name=[];
					  for (var i in rows) {
					          field_name.push(rows[i].field_name + ' as ' + '"' + rows[i].caption_name + '"');

							}

					  var select_data = connection.query('SELECT id,' +field_name+ ' FROM ' + tbl_name + ' where id='+rowid, function(err, rowdata,fields) {
					   var resultdata=JSON.stringify(rowdata);
					 res.render("addnewdata.ejs", { supplies:rows,editdata:resultdata});


		});

});
});

//Listing Users

app.get('/list_user',checkAuth,function(req, res, next){

   var select_query = connection.query('SELECT name,email FROM users', function(err, rows) {
	            res.render("list_user.ejs", {supplies:rows});
		});
});

//Creating table and inserting data into table
app.use(bodyParser.urlencoded({ extended: false }));
				app.post('/data',checkAuth, function(req, res, next){

							var values=[req.body.menu_name,req.body.table_name,req.body.category_type];

							var sql = "INSERT INTO base_table (menu_name,table_name,category) VALUES (?)";
							var query=connection.query(sql, [values], function(err,result) {
							var last_insert_id=result.insertId;

							var dataary=[];
							var name_array=[];
							var search_array=[];
							name_array=req.body.cap_name;
							search_array=req.body.search_status_name;
							var checkdata = name_array;
							var checksearch = search_array;
							displayresult = checkdata.map(v => v? '1' :'0');
							displaysearch = checksearch.map(v => v? '1' :'0');
							dataary=[req.body.field_name,req.body.field_type,req.body.field_size,req.body.field_caption,displayresult,displaysearch];
							var allLengths = dataary.map(element => {
							   return element.length;
							});
							var field_length=allLengths[0];
							 var newArray = [];
								for(var i = 0; i < field_length; i++){

									newArray.push([last_insert_id]);
								};

								for(var i = 0; i < dataary.length; i++){
									for(var j = 0; j < field_length; j++){
										newArray[j].push(dataary[i][j]);

									};
								};
							var sql2 = "INSERT INTO field_details (table_id,field_name,field_type,field_size,caption_name,display_status,display_search) VALUES ?";
							var query2=connection.query(sql2, [newArray], function(err,result) {


							});
						var query_create = connection.query('CREATE TABLE '+ req.body.table_name +'(id INT(100) NOT NULL AUTO_INCREMENT, PRIMARY KEY(id))' , function(err, result) {
							   // Neat!
							});
						for(var i = 0; i < newArray.length; i++){
								var field_name=[];

								if(newArray[i][2] =='date')
								{
								    var date_field_name=newArray[i][1];
									field_name.push(newArray[i][1] +' '+newArray[i][2]);
								}
								else
								{
								field_name.push(newArray[i][1] +' '+newArray[i][2] + '('+newArray[i][3]+')');
								}

									var query_alter = connection.query('ALTER TABLE '+ req.body.table_name +' ADD COLUMN '+ field_name, function(err, result) {

										});
								};
								var insertdata=[];
								let data=req.body.jsondata;
							     insertdata = JSON.parse(data);

						       for(var i = 0; i < insertdata.length; i++){
									var post=[];
									post  = insertdata[i];
									var querydd = connection.query('INSERT INTO '+ req.body.table_name + ' SET ?', post, function(err, result) {

									});

								}
							});

						  requestNews(function(err, data) {
							if (err) return next(err);
							var keys=[];
							var sendata=[];
							var savefile='';
							var table_name='';
							 var resultdata=JSON.stringify(data);
							res.render("index.ejs", {user: req.session.role,supplies:data,myArray:keys,sendata:sendata,resultdata:resultdata,filename:savefile,table_name:table_name});
						  });
				});
app.use(bodyParser.json());
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

//Common function for displying menu
var requestNews = function(callback){

      var keys=[];
	  var sendata=[];
	  var savefile='';
	  var table_name='';
      var select_query = connection.query('SELECT id,menu_name,table_name,categories.category_name FROM base_table, categories WHERE categories.category_id = base_table.category', function(err, rows) {
	          callback(null, rows);


		}); 

};

//Inserting new data into table
app.post('/inserttabledata',checkAuth, function(req, res, next){

							var field_data=req.body.datarr;
							var tablename=req.body.tablename;
							var field_name=req.body.fieldarr;
							var fieldarray = field_name.split(',');
							var dataarray = field_data.split(',');
							var dataquery=connection.query('INSERT INTO '+ tablename + '(' +fieldarray + ') VALUES (?)', [dataarray], function(err,result) {
										res.send();
                                      });

							});
//Updating  table data
app.post('/edittabledata',checkAuth, function(req, res, next){

							var field_data=req.body.datarr;
							var tablename=req.body.tablename;
							var field_name=req.body.fieldarr;
							var rowid=req.body.rowid;
							var fieldarray = field_name.split(',');
							var dataarray = field_data.split(',');
							var field_name_array=[];
							$i=0;
							for (var i in fieldarray) {
								for (var i in dataarray) {
								  field_name_array.push(fieldarray[i] + ' =' + '"'+dataarray[i]+'"');

								}
							$i++;
                           if($i==1) break;
							}
							var query = 'UPDATE ' + tablename + ' SET ' + field_name_array + ' WHERE id='+rowid;

                            var updatequery=connection.query(query,function (err,result) {

										res.send();
                                      });
							});

//Deleting table data
app.post('/deletedata',checkAuth, function(req, res, next){

							var menu_id=req.body.menu_id;
							var rowid=req.body.rowid;
							var select_query = connection.query('SELECT table_name FROM base_table WHERE id='+menu_id, function(err, rows) {
							var tbl_name = rows[0].table_name;
							 var deletedata = 'DELETE FROM ' + tbl_name + ' WHERE id='+rowid;
							  connection.query(deletedata, function (err, result) {

								 res.send();
							  });




		});
});

//Inserting new category
app.post('/api/insertcategory',checkAuth, function(req, res, next){

							var field_data=req.body.name;

							var sql = "INSERT INTO categories (category_name) VALUES (?)";
							var query=connection.query(sql, field_data, function(err,result) {


                                      });

							});
//Check menu name and table exist or not
app.post('/check/data_exist',checkAuth, function(req, res, next){

							var table_name=req.body.tablename;
							var menu_name=req.body.menu_name;
                            var select_query = connection.query('SELECT table_name,menu_name FROM base_table where table_name="'+table_name+'" OR menu_name="'+menu_name+'"', function(err, rows) {
					                if (rows.length > 0) {

											  if(rows[0].table_name !='' && rows[0].menu_name !='')
													{

												        res.send('1');
												  }

												}
										      else
											   {
													res.send('2');
											    }


							  });

							});

//Logout
app.get('/logout',function(req,res){
req.session.destroy();
res.redirect('/');
});
app.listen(8012);
