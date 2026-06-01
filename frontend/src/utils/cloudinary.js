export const uploadToCloudinary = async (file, getToken, API_BASE_URL) => {
  try {
    // 1. Get signature from backend
    const sigRes = await fetch(`${API_BASE_URL}/api/admin/upload-signature`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const sigData = await sigRes.json();
    
    // 2. Upload to Cloudinary directly
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.api_key);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', 'popartsdvg');
    
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';
    
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!uploadRes.ok) {
      throw new Error('Failed to upload file to Cloudinary');
    }
    
    const uploadData = await uploadRes.json();
    return uploadData.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
