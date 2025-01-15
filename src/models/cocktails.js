// src/models/Cocktail.js
import mongoose from 'mongoose';

const CocktailSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  flavor: String,
  instructions: String,
  glassType: String,
  garnish: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
CocktailSchema.index({ name: 1 });
CocktailSchema.index({ alcoholic: 1 });
CocktailSchema.index({ ingredients: "text" });

export default mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema);
