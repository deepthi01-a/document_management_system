const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: { 
    type: String, 
    enum: ['contract', 'legal-brief', 'court-filing', 'correspondence', 'research', 'general'],
    default: 'general' 
  },
  content: { 
    type: String, 
    required: [true, 'Document content is required']
  },
  file: {
    filename: String,
    originalname: String,
    path: String,
    size: Number
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: String, // For now, store username as string
    default: 'system'
  },
  updatedBy: {
    type: String,
    default: 'system'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This replaces manual createdAt/updatedAt
});

// Add text search index
DocumentSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Document', DocumentSchema);
