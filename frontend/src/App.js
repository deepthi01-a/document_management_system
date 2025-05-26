// import React, { useEffect, useState } from "react";
// import "./App.css";

// const API_BASE = "http://localhost:3000";

// function App() {
//   const [health, setHealth] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [form, setForm] = useState({ title: "", content: "", category: "" });
//   const [message, setMessage] = useState("");

//   // Fetch health status
//   useEffect(() => {
//     fetch(`${API_BASE}/health`)
//       .then((res) => res.json())
//       .then(setHealth);
//   }, []);

//   // Fetch all documents
//   const fetchDocuments = () => {
//     fetch(`${API_BASE}/api/documents`)
//       .then((res) => res.json())
//       .then((data) => setDocuments(data.documents || []));
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle form submit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setMessage("");
//     fetch(`${API_BASE}/api/documents`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setMessage("Document uploaded!");
//           setForm({ title: "", content: "", category: "" });
//           fetchDocuments();
//         } else {
//           setMessage(data.message || "Error uploading document.");
//         }
//       })
//       .catch(() => setMessage("Server error"));
//   };

//   return (
//     <div className="container">
//       <h1>Legal Document Management System</h1>
//       <section className="status">
//         <h2>API Health Status</h2>
//         {health ? (
//           <span className={health.status === "healthy" ? "healthy" : "unhealthy"}>
//             {health.status}
//           </span>
//         ) : (
//           <span>Loading...</span>
//         )}
//       </section>

//       <section className="upload">
//         <h2>Upload New Document</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             name="title"
//             placeholder="Title"
//             value={form.title}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="category"
//             placeholder="Category"
//             value={form.category}
//             onChange={handleChange}
//           />
//           <textarea
//             name="content"
//             placeholder="Content"
//             value={form.content}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit">Upload</button>
//         </form>
//         {message && <div className="message">{message}</div>}
//       </section>

//       <section className="documents">
//         <h2>All Documents</h2>
//         {documents.length === 0 ? (
//           <p>No documents found.</p>
//         ) : (
//           <ul>
//             {documents.map((doc) => (
//               <li key={doc.id}>
//                 <strong>{doc.title}</strong> <em>({doc.category})</em>
//                 <div>{doc.content || <span className="file">[File uploaded]</span>}</div>
//                 <small>Created: {new Date(doc.createdAt).toLocaleString()}</small>
//               </li>
//             ))}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:3000";

function App() {
  const [health, setHealth] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "" });

  // Fetch health status
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then(setHealth);
  }, []);

  // Fetch all documents
  const fetchDocuments = () => {
    fetch(`${API_BASE}/api/documents`)
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (create)
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    fetch(`${API_BASE}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Document uploaded!");
          setForm({ title: "", content: "", category: "" });
          fetchDocuments();
        } else {
          setMessage(data.message || "Error uploading document.");
        }
      })
      .catch(() => setMessage("Server error"));
  };

  // Edit handlers
  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditForm({ title: doc.title, content: doc.content || "", category: doc.category || "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/api/documents/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((data) => {
        setEditingId(null);
        fetchDocuments();
      });
  };

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    fetch(`${API_BASE}/api/documents/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchDocuments());
  };

  return (
    <div className="container">
      <h1>Legal Document Management System</h1>
      <section className="status">
        <h2>API Health Status</h2>
        {health ? (
          <span className={health.status === "healthy" ? "healthy" : "unhealthy"}>
            {health.status}
          </span>
        ) : (
          <span>Loading...</span>
        )}
      </section>

      <section className="upload">
        <h2>Upload New Document</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <button type="submit">Upload</button>
        </form>
        {message && <div className="message">{message}</div>}
      </section>

      <section className="documents">
        <h2>All Documents</h2>
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <ul>
            {documents.map((doc) =>
              editingId === doc.id ? (
                <li key={doc.id}>
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                    />
                    <textarea
                      name="content"
                      value={editForm.content}
                      onChange={handleEditChange}
                      required
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li key={doc.id}>
                  <strong>{doc.title}</strong> <em>({doc.category})</em>
                  <div>{doc.content || <span className="file">[File uploaded]</span>}</div>
                  <small>Created: {new Date(doc.createdAt).toLocaleString()}</small>
                  <br />
                  <button onClick={() => startEdit(doc)}>Edit</button>
                  <button onClick={() => handleDelete(doc.id)} style={{ marginLeft: "0.5em" }}>
                    Delete
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
