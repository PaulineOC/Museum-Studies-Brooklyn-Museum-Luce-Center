var express = require('express');
var app = express();
var db = require('./db.js');
var path = require('path');

var bodyParser = require('body-parser');
var handlebars = require('hbs');

var mongoose = require('mongoose');
var museumObj = mongoose.model('MuseumObject');

//For Images
var fs = require('fs');
var multer = require('multer');
//Saves to memory storage 
var upload = multer({ storage: multer.memoryStorage({}) });

//Port setting
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/AdvancedSearch', function(req, res) {
	res.render('AdvancedSearch');
});

app.get('/AskUs', function(req, res) {
	res.render('AskUs');
});

app.get('/Themes', function(req, res) {
	res.render('Themes');
});

app.get('/AddObj',  function(req, res) {
	res.render('AddObj');
});

app.post('/AddObj',upload.single('pic'),function(req,res) {

	console.log("here is the req.body");
	console.log(req.body);
	var base64 = req.file.buffer.toString('base64');

	var dim='';
	if(req.body.length && req.body.width && req.body.height){
		dim = req.body.req.body.length +" x "+req.body.width+" x "+req.body.height
	}
	var newObj = new museumObj({
		'accessionNum': req.body.accession,
		'maker': req.body.maker,
		'manufacturer': req.body.manufacturer,
		'title': req.body.title,
		'date': req.body.date,
		'medium': req.body.medium,
		'dimesions': dim,
		'marks': req.body.marks,
		'description': req.body.description,
		'pic': base64,
	});

	console.log('here is the new object before calling the save function');
	console.log(newObj);
	newObj.save(function(err,item, count){
		if (err){
			console.log("there is an error");
			console.log(err);
		}
		else{
			console.log('here is the "successfully" saved item');
			console.log(item);
			//res.redirect('/');
		}
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

