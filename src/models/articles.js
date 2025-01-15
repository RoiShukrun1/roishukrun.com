// src/models/Article.js
import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  tags: [String],
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
