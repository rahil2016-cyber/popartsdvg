
const pool = require('../config/db');

// Get all active reels (public)
const getReels = async (req, res) => {
  try {
    const [reels] = await pool.execute(
      'SELECT * FROM insta_reels WHERE is_active = 1 ORDER BY position ASC, created_at DESC'
    );
    res.json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error);
    // Try fallback table name
    try {
      const [reels] = await pool.execute(
        'SELECT * FROM reels WHERE is_active = 1 ORDER BY position ASC, created_at DESC'
      );
      res.json(reels);
    } catch (e) {
      res.json([]); // Return empty array rather than error
    }
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
    try {
      const [reels] = await pool.execute(
        'SELECT * FROM reels ORDER BY position ASC, created_at DESC'
      );
      res.json(reels);
    } catch (e) {
      res.json([]);
    }
  }
};

// Create reel
const createReel = async (req, res) => {
  try {
    console.log('Create reel request body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'none');
    
    let media_url = req.body.media_url || null;
    let media_type = req.body.media_type || 'image';
    
    // If file is uploaded
    if (req.file) {
      media_url = req.file.path && req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
      media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    if (!media_url) {
      return res.status(400).json({ message: 'Please upload a media file or provide a media URL' });
    }
    
    const is_active = req.body.is_active === true || req.body.is_active === 'true' ? 1 : 1;
    const position = req.body.position ? parseInt(req.body.position) : 0;
    
    // Try insta_reels first, fallback to reels
    let result;
    try {
      [result] = await pool.execute(
        'INSERT INTO insta_reels (media_url, media_type, is_active, position) VALUES (?, ?, ?, ?)',
        [media_url, media_type, is_active, position]
      );
    } catch (tableErr) {
      console.log('insta_reels failed, trying reels:', tableErr.message);
      [result] = await pool.execute(
        'INSERT INTO reels (media_url, media_type, is_active, position) VALUES (?, ?, ?, ?)',
        [media_url, media_type, is_active, position]
      );
    }
    
    res.status(201).json({ 
      id: result.insertId, 
      media_url, 
      media_type, 
      is_active: 1, 
      position,
      message: 'Reel created successfully' 
    });
  } catch (error) {
    console.error('Error creating reel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update reel
const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    let { media_url, media_type, is_active, position } = req.body;
    
    if (req.file) {
      media_url = req.file.path && req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
      media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    // First get existing reel to preserve media_url if not changed
    if (!media_url) {
      try {
        const [existing] = await pool.execute('SELECT media_url, media_type FROM insta_reels WHERE id = ?', [id]);
        if (existing.length > 0) {
          media_url = existing[0].media_url;
          if (!media_type) media_type = existing[0].media_type;
        }
      } catch (e) {
        // ignore
      }
    }
    
    const activeValue = is_active === true || is_active === 'true' ? 1 : 0;
    const positionValue = position !== undefined ? parseInt(position) : 0;
    
    try {
      await pool.execute(
        'UPDATE insta_reels SET media_url = ?, media_type = ?, is_active = ?, position = ? WHERE id = ?',
        [media_url, media_type || 'image', activeValue, positionValue, id]
      );
    } catch (e) {
      await pool.execute(
        'UPDATE reels SET media_url = ?, media_type = ?, is_active = ?, position = ? WHERE id = ?',
        [media_url, media_type || 'image', activeValue, positionValue, id]
      );
    }
    
    res.json({ id, media_url, media_type, is_active: activeValue, position: positionValue });
  } catch (error) {
    console.error('Error updating reel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete reel
const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await pool.execute('DELETE FROM insta_reels WHERE id = ?', [id]);
    } catch (e) {
      await pool.execute('DELETE FROM reels WHERE id = ?', [id]);
    }
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
