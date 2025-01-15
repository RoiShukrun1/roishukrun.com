// src/models/Cigar.js
import mongoose from 'mongoose';

const CigarSchema = new mongoose.Schema({
  name: String,
  brand: String,
  origin: String,
  flavorProfile: String,
  strength: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
CigarSchema.index({ name: 1 });
CigarSchema.index({ brand: 1 });
CigarSchema.index({ strength: 1 });
CigarSchema.index({ price: 1 });

export default mongoose.models.Cigar || mongoose.model('Cigar', CigarSchema);
