const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


//user Schema
const UserSchema = new mongoose.Schema({
  username:{type: String, unique: true, required: true},
  email:{type: String, unique: true, required: true},
  password:{type: String, unique: true, required: true},
});

//article schema
const ArticleSchema = new mongoose.Schema({
  userid: String,
  title:String,
  url:String,
  description:String,
});

//slugs
ArticleSchema.plugin(URLSlugs('title'));


mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);
//connect to db
mongoose.connect('mongodb://localhost/hw06');
