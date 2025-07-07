import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_BASE = "http://localhost:3000";

function Dashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    recentDocs: 0,
    categories: {}
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', category: '' });

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/documents`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const calculateStats = () => {
    const total = documents.length;
    const recent = documents.filter(doc => {
      const created = new Date(doc.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length;

    const categories = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {});

    setStats({ totalDocs: total, recentDocs: recent, categories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', form); // <-- Add this line
    try {
      const response = await fetch(`${API_BASE}/api/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        setForm({ title: '', content: '', category: '' });
        setShowCreateForm(false);
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setEditForm({ title: doc.title, content: doc.content, category: doc.category });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/documents/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        setEditingId(null);
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/documents/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Legal Document Management</h1>
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{stats.totalDocs}</h3>
            <p>Total Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-info">
            <h3>{stats.recentDocs}</h3>
            <p>Recent (7 days)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <h3>{Object.keys(stats.categories).length}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>System Status</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          {showCreateForm ? 'Cancel' : '+ New Document'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="create-form-container">
          <form onSubmit={handleSubmit} className="document-form">
            <h3>Create New Document</h3>
            <input
              type="text"
              placeholder="Document Title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="contract">Contract</option>
              <option value="legal-brief">Legal Brief</option>
              <option value="court-filing">Court Filing</option>
              <option value="correspondence">Correspondence</option>
              <option value="research">Research</option>
              <option value="general">General</option>
            </select>
            <textarea
              placeholder="Document Content"
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              required
            />
            <button type="submit">Create Document</button>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="documents-section">
        <h2>Your Documents</h2>
        {documents.length === 0 ? (
          <div className="empty-state">
            <p>No documents yet. Create your first document!</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map(doc => (
              <div key={doc._id} className="document-card">
                {editingId === doc._id ? (
                  <form onSubmit={handleUpdate} className="edit-form">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      required
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="contract">Contract</option>
                      <option value="legal-brief">Legal Brief</option>
                      <option value="court-filing">Court Filing</option>
                      <option value="correspondence">Correspondence</option>
                      <option value="research">Research</option>
                      <option value="general">General</option>
                    </select>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      required
                    />
                    <div className="edit-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="document-header">
                      <h3>{doc.title}</h3>
                      <span className="category-tag">{doc.category}</span>
                    </div>
                    <p className="document-content">
                      {doc.content ? doc.content.substring(0, 150) + '...' : 'File document'}
                    </p>
                    <div className="document-meta">
                      <small>Created: {new Date(doc.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="document-actions">
                      <button onClick={() => handleEdit(doc)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(doc._id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
