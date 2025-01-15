// src/models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

// Indexes
ContactSchema.index({ phone: 1 });
ContactSchema.index({ submittedAt: -1 }); // descending if frequently sorted by newest first

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
