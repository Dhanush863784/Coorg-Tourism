import { useState, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import ErrorMessage from './ErrorMessage';

export default function ImageUpload({ currentImageUrl, onImageUploaded }) {
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Basic frontend validation
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Only JPG, JPEG, PNG, and WEBP formats are allowed');
            return;
        }

        setError('');
        setSuccess('');
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setError('');
        setProgress(0);

        try {
            const response = await axiosInstance.post('/uploads/images', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            setSuccess('Image uploaded successfully!');
            if (onImageUploaded) {
                onImageUploaded(response.data.imageUrl);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image');
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fafafa', marginBottom: '20px' }}>
            <ErrorMessage message={error} />
            {success && <div style={{ color: '#2d5a27', background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div 
                    style={{ 
                        width: '150px', height: '150px', 
                        backgroundColor: '#eee', 
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed #ccc'
                    }}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>No Image Selected</span>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".jpg,.jpeg,.png,.webp" 
                        style={{ display: 'none' }} 
                    />
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <button type="button" onClick={triggerFileSelect} className="btn-secondary">
                            {previewUrl ? 'Change Image' : 'Select Image'}
                        </button>
                        
                        {file && (
                            <button 
                                type="button" 
                                onClick={handleUpload} 
                                disabled={uploading} 
                                className="btn-primary"
                            >
                                {uploading ? `Uploading ${progress}%` : 'Upload Now'}
                            </button>
                        )}
                    </div>
                    
                    {uploading && (
                        <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', height: '8px' }}>
                            <div style={{ width: `${progress}%`, backgroundColor: '#2d5a27', height: '100%', borderRadius: '4px', transition: 'width 0.3s' }}></div>
                        </div>
                    )}
                    
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Max file size: 5MB. Formats: JPG, PNG, WEBP.
                    </p>
                </div>
            </div>
        </div>
    );
}
