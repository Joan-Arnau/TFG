import { useState, useEffect } from 'react';

const ImageUpload = ({ currentImageUrl, onFileSelect }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);

  useEffect(() => {
    setTimeout(() => setPreviewUrl(currentImageUrl), 0);
  }, [currentImageUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file); // Expose the file to the parent
    }
  };

  return (
    <div className="image-upload-container">
      {previewUrl && (
        <div className="image-preview mb-3">
          <img src={previewUrl} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px', maxHeight: '200px' }} />
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
    </div>
  );
};

export default ImageUpload;
