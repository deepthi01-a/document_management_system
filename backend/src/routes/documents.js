const express = require('express');
const multer = require('multer');
const router = express.Router();
const Document = require('../models/Document');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET all documents (MongoDB)
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: docs.length, documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching documents', error: error.message });
  }
});

// POST create new document (MongoDB)
router.post('/', async (req, res) => {
  console.log('Received body:', req.body); // Add this line
  try {
    const { title, content, category, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const doc = new Document({
      title,
      content,
      category: category || 'general',
      status: status || 'draft',
      createdBy: req.user ? req.user.username : 'system',
      updatedBy: req.user ? req.user.username : 'system'
    });
    await doc.save();
    res.status(201).json({
      success: true,
      message: 'Document saved to database',
      document: doc
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating document', error: error.message });
  }
});

// POST create document with file upload (MongoDB)
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const doc = new Document({
      title,
      content,
      category: category || 'general',
      status: 'draft',
      file: req.file ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : null,
      createdBy: req.user ? req.user.username : 'anonymous',
      isActive: true
    });
    await doc.save();
    res.status(201).json({ success: true, message: 'Document with file created successfully', document: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error uploading document', error: error.message });
  }
});

// GET single document by ID (MongoDB)
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.isActive) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching document', error: error.message });
  }
});

// PUT update document by ID (MongoDB)
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        status,
        updatedBy: req.user ? req.user.username : 'system'
      },
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document updated successfully', document: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating document', error: error.message });
  }
});

// DELETE document by ID (MongoDB, soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.user ? req.user.username : 'system' },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully', document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting document', error: error.message });
  }
});

module.exports = router;
