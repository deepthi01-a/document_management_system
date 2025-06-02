const express = require('express');
const multer = require('multer');
const router = express.Router();
const Document = require('../models/Document');

// In-memory storage for documents (for demo purposes)
let documents = [];

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

// GET all documents (in-memory)
router.get('/', (req, res) => {
  try {
    res.json({ 
      success: true, 
      count: documents.length,
      documents 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching documents',
      error: error.message 
    });
  }
});

// POST create new document (in-memory)
router.post('/', (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const newDocument = {
      id: documents.length + 1,
      title,
      content,
      file: null,
      category: category || 'general',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user ? req.user.username : 'anonymous',
      isActive: true
    };

    documents.push(newDocument);
    
    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      document: newDocument
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating document',
      error: error.message 
    });
  }
});

// POST create document with file upload (in-memory)
router.post('/upload', upload.single('document'), (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const newDocument = {
      id: documents.length + 1,
      title,
      content,
      file: req.file ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : null,
      category: category || 'general',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user ? req.user.username : 'anonymous',
      isActive: true
    };

    documents.push(newDocument);
    
    res.status(201).json({
      success: true,
      message: 'Document with file created successfully',
      document: newDocument
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error uploading document',
      error: error.message 
    });
  }
});

// GET single document by ID (in-memory)
router.get('/:id', (req, res) => {
  try {
    const docId = parseInt(req.params.id);
    const doc = documents.find(d => d.id === docId);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    res.json({ 
      success: true, 
      document: doc 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching document',
      error: error.message 
    });
  }
});

// PUT update document by ID (in-memory)
router.put('/:id', (req, res) => {
  try {
    const docId = parseInt(req.params.id);
    const doc = documents.find(d => d.id === docId);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    const { title, content, category, status } = req.body;
    
    // Update fields if provided
    if (title) doc.title = title;
    if (content) doc.content = content;
    if (category) doc.category = category;
    if (status) doc.status = status;
    doc.updatedAt = new Date().toISOString();
    doc.updatedBy = req.user ? req.user.username : 'anonymous';
    
    res.json({ 
      success: true, 
      message: 'Document updated successfully',
      document: doc 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating document',
      error: error.message 
    });
  }
});

// DELETE document by ID (in-memory)
router.delete('/:id', (req, res) => {
  try {
    const docId = parseInt(req.params.id);
    const index = documents.findIndex(d => d.id === docId);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    const deletedDoc = documents[index];
    documents.splice(index, 1);
    
    res.json({ 
      success: true, 
      message: 'Document deleted successfully',
      deletedDocument: deletedDoc
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting document',
      error: error.message 
    });
  }
});

// =============================================
// MONGODB DATABASE ROUTES (Enterprise Features)
// =============================================

// GET all documents from database
router.get('/db/all', async (req, res) => {
  try {
    const docs = await Document.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: docs.length,
      documents: docs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// POST create document in database
router.post('/db', async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
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
    res.status(400).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// GET single document from database
router.get('/db/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    
    if (!doc || !doc.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    res.json({ 
      success: true, 
      document: doc 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// PUT update document in database
router.put('/db/:id', async (req, res) => {
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
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Document updated in database',
      document: doc 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// DELETE document from database (soft delete)
router.delete('/db/:id', async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        updatedBy: req.user ? req.user.username : 'system'
      },
      { new: true }
    );
    
    if (!doc) {
      return res.status(404).json({ 
        success: false, 
        message: 'Document not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Document deleted from database',
      document: doc
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// Search documents in database
router.get('/db/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const docs = await Document.find({
      $text: { $search: query },
      isActive: true
    }).sort({ score: { $meta: 'textScore' } });
    
    res.json({ 
      success: true, 
      query: query,
      count: docs.length,
      documents: docs 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Search error',
      error: error.message 
    });
  }
});

// Get documents by category from database
router.get('/db/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const docs = await Document.find({ 
      category: category,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      category: category,
      count: docs.length,
      documents: docs 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// Get documents by status from database
router.get('/db/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    const docs = await Document.find({ 
      status: status,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      status: status,
      count: docs.length,
      documents: docs 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

module.exports = router;
