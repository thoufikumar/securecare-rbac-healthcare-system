import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecordFolders = ({ folders }) => {
  const navigate = useNavigate();

  return (
    <div className="folder-grid">
      {folders.map(folder => (
        <div key={folder.id} className="folder-card" onClick={() => navigate(`/doctor/records/${folder.id}`)}>
          <div className="folder-icon" style={{ backgroundColor: `${folder.color}20`, color: folder.color }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 className="folder-title">{folder.title}</h3>
          <p className="folder-meta">{folder.files} Files &bull; {folder.size}</p>
        </div>
      ))}
    </div>
  );
};

export default RecordFolders;
