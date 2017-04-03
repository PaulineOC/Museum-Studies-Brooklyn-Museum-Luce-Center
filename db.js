var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');


var MuseumObject = new mongoose.Schema({
  accessionNum: String,
  maker: {String, default: ''},
  manufacturer: {String, default: ''},
  title: String,  
  date: {String, default: ''},
  medium: {String, default: ''}, 
  dimensions: {String, default: ''},
  marks: {String, default: ''},
  description: {String, default: ''},
  pic: {String, default: ''}
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
 dbconf = 'mongodb://localhost/BKMuseum1';
}

mongoose.connect(dbconf);