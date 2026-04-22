// import React, { useState } from 'react';
// import { registerVideo } from '../services/api.js';
// import Loader from './Loader.jsx';
// import '../styles/forms.css';

// const RegisterPanel = () => {
//   const [form, setForm] = useState({ video_path: '', video_id: '' });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSubmit = async () => {
//     if (!form.video_path || !form.video_id) {
//       setError('All fields are required.');
//       return;
//     }
//     setLoading(true); setError(''); setSuccess('');
//     try {
//       const data = await registerVideo(form.video_path, form.video_id);
//       setSuccess(data?.message || `Asset "${form.video_id}" registered successfully.`);
//       setForm({ video_path: '', video_id: '' });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="panel-card glass-card">
//       <div className="panel-header">
//         <div className="panel-title">ASSET REGISTRATION</div>
//         <div className="panel-description">
//           Register an original video asset to generate a protected fingerprint. Once registered, any pirated copies can be detected automatically.
//         </div>
//       </div>

//       <div className="form-row">
//         <div className="form-group">
//           <label className="form-label">Video Path</label>
//           <input
//             className="form-input"
//             name="video_path"
//             value={form.video_path}
//             onChange={handleChange}
//             placeholder="/data/assets/original.mp4"
//           />
//           <div className="form-hint">Absolute path to the video file</div>
//         </div>
//         <div className="form-group">
//           <label className="form-label">Video ID</label>
//           <input
//             className="form-input"
//             name="video_id"
//             value={form.video_id}
//             onChange={handleChange}
//             placeholder="ASSET-2024-001"
//           />
//           <div className="form-hint">Unique identifier for this asset</div>
//         </div>
//       </div>

//       <div className="form-submit-area">
//         <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
//           {loading ? 'Registering...' : '+ Register Asset'}
//         </button>
//         <div className="form-api-note">POST <span>/register</span></div>
//       </div>

//       {loading && <Loader text="Generating fingerprint..." />}
//       {error && <div className="error-msg">⚠ {error}</div>}
//       {success && (
//         <div className="success-msg">
//           <div className="success-icon">✓</div>
//           {success}
//         </div>
//       )}
//     </div>
//   );
// };
// export default RegisterPanel;