var express = require('express');
var app = express();
var db = require('./db.js');
var path = require('path');

var bodyParser = require('body-parser');

var handlebars = require('hbs');


var mongoose = require('mongoose');
var museumObj = mongoose.model('MuseumObject');
mongoose.Promise = global.Promise;


//For Images
var fs = require('fs');
var multer = require('multer');
//Saves to memory storage 
var upload = multer({ storage: multer.memoryStorage({}) });

//Port setting
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/mapSearch', function(req, res) {
	res.render('mapSearch', {layout: 'layout2.hbs'});
});

app.post('/mapSearch',function(req,res){
	console.log(req.body);
	if(req.body.caseNum){
		museumObj.find({  "location": req.body.caseNum}, function(err, obj, count){
			if(err){
				console.log(err);
			}
			else{
			res.render('Search', {'searchTerm': obj, "location":req.body.caseNum });
			}
		});
	}
});

app.get('/AdvancedSearch', function(req, res) {
	res.render('AdvancedSearch');
});

app.post('/AdvancedSearch', function(req,res){
	if(req.body){
		var keys=[];
		if(req.body.keywords){
			keys = req.body.keywords.split(',');
		}
		museumObj.find({ $or: [{ "accessionNum": req.body.accession},{"maker":req.body.maker},{"manufacturer":req.body.manufacturer},{"title":req.body.title},{"date":req.body.date},{"medium":req.body.medium},{"location":req.body.location},{'furtherKeywords': { $in: keys}}]},function(err,obj){
			if(obj){
				res.render('Search', {'searchTerm': obj, "advancedterm": req.body});
			}
			else{
				console.log(err);
			}
		});
	}
});

app.get('/AskUs', function(req, res) {
	res.redirect('https://www.brooklynmuseum.org/ask');
});

app.get('/Themes', function(req, res) {
	res.render('Themes');
});


app.get('/search', function(req,res){
	//console.log(req.query.search);
	museumObj.find({ $or: [{ "accessionNum":req.query.search},{"maker":req.query.search},{"manufacturer":req.query.search},{"title":req.query.search},{"date":req.query.search},{"medium":req.query.search},{"location":req.query.search},{'furtherKeywords': req.query.search}]}, function(err, obj, count) {
		res.render('Search', {'searchTerm': obj,"generalterm":req.query.search});
	});
});


app.post('/keyTerm',function(req,res){
	var results=[];
	var word =req.body.keyWord.toLowerCase().trim();

	museumObj.find({}).then(function(rs){
		rs.forEach(function(ele){
			if(subjectSearch(ele, word)){
				results.push(ele);
			}
		});
		res.render('Search', {'generalterm':word, 'searchTerm': results});
	});
});


app.get('/object/:slug',function(req,res){
	museumObj.findOne({slug: req.params.slug},function(err, obj,count){
		res.render('Slug-Obj', {'object':obj});
	});
});

app.get('/AddObj',  function(req, res) {
	res.render('AddObj');
});

app.post('/AddObj',upload.single('pic'),function(req,res) {
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
		'location': req.body.location
	});
	//Further Material:
	if(req.body.articles && req.body.artLinks){
		var splitArticles = req.body.articles.split(',,');
		var splitArtLinks= req.body.artLinks.split(',');
		for(var i=0;i<splitArticles.length;i++){
			splitArticles[i] = splitArticles[i].replace(/(\r\n|\n|\r)/gm,"");
			splitArticles[i].trim();
			splitArtLinks[j] = splitArtLinks[i].replace(/(\r\n|\n|\r)/gm,"");
		 	splitArtLinks[j].trim();
		 	var newArticle = {
		 		'article':splitArticles[i],
		 		'link':splitArtLinks[i],
		 	}
			newObj.furtherArticles.push(newArticle);
		}
	}
	if(req.body.links){
		var splitLinks = req.body.links.split(',');
		for(var j=0;j<splitLinks.length;j++){
			splitLinks[j] = splitLinks[j].replace(/(\r\n|\n|\r)/gm,"");
			splitLinks[j].trim();
			newObj.furtherLinks.push(splitLinks[j]);
		}
	}

	if(req.body.subject){
		var splitSubject = req.body.subject.split(',,');
		for(var i=0;i<splitSubject.length;i++){
			splitSubject[i] = splitSubject[i].replace(/(\r\n|\n|\r)/gm,"");
			splitSubject[i].trim();
			splitSubject[i].toLowerCase();
			newObj.subject.push(splitSubject[i]);
		}
	}



	newObj.save(function(err,item, count){
		if (err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

