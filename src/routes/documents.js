// const express = require('express');
// const multer = require('multer');
// const router = express.Router();

// // Uncomment the next line if you want to require authentication for protected routes
// // const { authenticateToken } = require('./auth');

// // In-memory storage for documents
// let documents = [];

// // Multer setup for file uploads (not used in basic React UI, but ready for future)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// /**
//  * GET /api/documents
//  * Returns all documents
//  */
// router.get('/', (req, res) => {
//   res.json({ success: true, documents });
// });

// /**
//  * POST /api/documents
//  * Creates a new document (accepts JSON body: {title, content, category})
//  */
// router.post('/', (req, res) => {
//   const { title, content, category } = req.body;
//   if (!title || !content) {
//     return res.status(400).json({ success: false, message: 'Title and content are required' });
//   }
//   const newDocument = {
//     id: documents.length + 1,
//     title,
//     content,
//     file: null,
//     category: category || 'general',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   };
//   documents.push(newDocument);
//   res.status(201).json({
//     success: true,
//     message: 'Document created successfully',
//     document: newDocument
//   });
// });

// /**
//  * (Optional) POST /api/documents/upload
//  * For file uploads via multipart/form-data (not used by basic React UI)
//  */
// router.post('/upload', upload.single('document'), (req, res) => {
//   const { title, category } = req.body;
//   if (!title || !req.file) {
//     return res.status(400).json({ success: false, message: 'Title and document file are required' });
//   }
//   const newDocument = {
//     id: documents.length + 1,
//     title,
//     content: null,
//     file: req.file.filename,
//     category: category || 'general',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   };
//   documents.push(newDocument);
//   res.status(201).json({
//     success: true,
//     message: 'Document uploaded successfully',
//     document: newDocument
//   });
// });

// /**
//  * PUT /api/documents/:id
//  * Updates a document by ID
//  */
// // router.put('/:id', authenticateToken, (req, res) => {
// router.put('/:id', (req, res) => {
//   const docId = parseInt(req.params.id);
//   const doc = documents.find(d => d.id === docId);
//   if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
//   const { title, content, category } = req.body;
//   if (title) doc.title = title;
//   if (content) doc.content = content;
//   if (category) doc.category = category;
//   doc.updatedAt = new Date().toISOString();
//   res.json({ success: true, document: doc });
// });

// /**
//  * DELETE /api/documents/:id
//  * Deletes a document by ID
//  */
// // router.delete('/:id', authenticateToken, (req, res) => {
// router.delete('/:id', (req, res) => {
//   const docId = parseInt(req.params.id);
//   const index = documents.findIndex(d => d.id === docId);
//   if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
//   documents.splice(index, 1);
//   res.json({ success: true, message: 'Document deleted' });
// });

// /**
//  * GET /api/documents/search/:title
//  * Searches documents by title (case-insensitive)
//  */
// // router.get('/search/:title', authenticateToken, (req, res) => {
// router.get('/search/:title', (req, res) => {
//   const title = req.params.title.toLowerCase();
//   const results = documents.filter(d => d.title.toLowerCase().includes(title));
//   res.json({ success: true, results });
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const router = express.Router();

// In-memory storage for documents
let documents = [];

// Multer setup for file uploads (future use)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// GET all documents
router.get('/', (req, res) => {
  res.json({ success: true, documents });
});

// POST create new document (JSON)
router.post('/', (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }
  const newDocument = {
    id: documents.length + 1,
    title,
    content,
    file: null,
    category: category || 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  documents.push(newDocument);
  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    document: newDocument
  });
});

// PUT update document by ID
router.put('/:id', (req, res) => {
  const docId = parseInt(req.params.id);
  const doc = documents.find(d => d.id === docId);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  const { title, content, category } = req.body;
  if (title) doc.title = title;
  if (content) doc.content = content;
  if (category) doc.category = category;
  doc.updatedAt = new Date().toISOString();
  res.json({ success: true, document: doc });
});

// DELETE document by ID
router.delete('/:id', (req, res) => {
  const docId = parseInt(req.params.id);
  const index = documents.findIndex(d => d.id === docId);
  if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
  documents.splice(index, 1);
  res.json({ success: true, message: 'Document deleted' });
});

module.exports = router;
