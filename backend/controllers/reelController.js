
const pool = require('../config/db');

// Get all active reels (public)
const getReels = async (req, res) => {
  try {
    const [reels] = await pool.execute(
      'SELECT * FROM insta_reels WHERE is_active = TRUE ORDER BY position ASC, created_at DESC'
    );
    res.json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reels (admin)
const getAllReels = async (req, res) => {
  try {
    const [reels] = await pool.execute(
      'SELECT * FROM insta_reels ORDER BY position ASC, created_at DESC'
    );
    res.json(reels);
  } catch (error) {
    console.error('Error fetching all reels:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create reel
const createReel = async (req, res) => {
  try {
    console.log('Create reel request:');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    let media_url = req.body.media_url;
    let media_type = req.body.media_type;
    
    // If file is uploaded
    if (req.file) {
      media_url = `/uploads/${req.file.filename}`;
      // Determine media type from file
      const mimeType = req.file.mimetype;
      if (mimeType.startsWith('video/')) {
        media_type = 'video';
      } else {
        media_type = 'image';
      }
    }
    
    const { is_active, position } = req.body;
    const activeValue = is_active === true || is_active === 'true';
    const positionValue = position ? parseInt(position) : 0;
    
    const [result] = await pool.execute(
      'INSERT INTO insta_reels (media_url, media_type, is_active, position) VALUES (?, ?, ?, ?)',
      [media_url, media_type || 'image', activeValue, positionValue]
    );
    
    const [newReel] = await pool.execute('SELECT * FROM insta_reels WHERE id = ?', [result.insertId]);
    res.status(201).json(newReel[0]);
  } catch (error) {
    console.error('Error creating reel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update reel
const updateReel = async (req, res) => {
  try {
    console.log('Update reel request:');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { id } = req.params;
    let { media_url, media_type, is_active, position } = req.body;
    
    // If file is uploaded
    if (req.file) {
      media_url = `/uploads/${req.file.filename}`;
      const mimeType = req.file.mimetype;
      if (mimeType.startsWith('video/')) {
        media_type = 'video';
      } else {
        media_type = 'image';
      }
    }
    
    const activeValue = is_active === true || is_active === 'true';
    const positionValue = position !== undefined ? parseInt(position) : 0;
    
    await pool.execute(
      'UPDATE insta_reels SET media_url = ?, media_type = ?, is_active = ?, position = ? WHERE id = ?',
      [media_url, media_type, activeValue, positionValue, id]
    );
    
    const [updatedReel] = await pool.execute('SELECT * FROM insta_reels WHERE id = ?', [id]);
    res.json(updatedReel[0]);
  } catch (error) {
    console.error('Error updating reel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete reel
const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM insta_reels WHERE id = ?', [id]);
    res.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('Error deleting reel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getReels,
  getAllReels,
  createReel,
  updateReel,
  deleteReel
};
