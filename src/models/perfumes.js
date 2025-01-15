// src/models/Perfume.js
import mongoose from 'mongoose';

const PerfumeSchema = new mongoose.Schema({
  name: String,
  brand: String,
  description: String,
  price: Number,
  notes: [String],
  releaseYear: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
PerfumeSchema.index({ name: 1 });
PerfumeSchema.index({ brand: 1 });
PerfumeSchema.index({ price: 1 });
PerfumeSchema.index({ releaseYear: -1 });

export default mongoose.models.Perfume || mongoose.model('Perfume', PerfumeSchema);
