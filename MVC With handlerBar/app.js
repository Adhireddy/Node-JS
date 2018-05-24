var express = require('express');
var http = require('http');
var path = require('path');
var handlebars  = require('express-handlebars'), hbs;
var app = express();

app.set('port', 1337);
/* Notice how we are using app.set(‘views’, path.join(__dirname, ‘views’)); to tell our handlebars engine to look for views in this directory*/
app.set('views', path.join(__dirname, 'views'));


/* create(): A convenience factory function for creating ExpressHandlebars instances.. */
hbs = handlebars.create({
   defaultLayout: 'main'
});
 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

require('./routes')(app); 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
