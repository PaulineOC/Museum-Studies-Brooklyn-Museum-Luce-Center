var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');


var MuseumObject = new mongoose.Schema({
  accessionNum: {type: String, default: ''},
  maker: {type: String, default: ''},
  manufacturer: {type: String, default: ''},
  title: {type: String, default: ''},
  date: {type: String, default: ''},
  medium: {type: String, default: ''}, 
  dimensions: {type: String, default: ''},
  marks: {type: String, default: ''},
  description: {type: String, default: ''},
  pic: {type: String, default: ''},
  furtherLinks: [String],
  furtherArticles: {type: Array},
  furtherKeywords:[String],
  location: String,
  subject: [String]
});

MuseumObject.plugin(URLSlugs('title'));
mongoose.model('MuseumObject', MuseumObject);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
  console.log("in production");
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);
 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} 
else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://pauline:mongo123@ds159180.mlab.com:59180/heroku_4sqrmtr5';
}

mongoose.connect(dbconf);