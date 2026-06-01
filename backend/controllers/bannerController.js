
const pool = require('../config/db');

const getBanners = async (req, res) => {
  try {
    const [banners] = await pool.execute(
      'SELECT * FROM banners WHERE is_active = 1 ORDER BY position, created_at DESC'
    );
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const [banners] = await pool.execute('SELECT * FROM banners ORDER BY position, created_at DESC');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, position } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO banners (title, subtitle, image_url, link_url, position) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle, imageUrl, linkUrl, position || 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Banner created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, linkUrl, position, isActive } = req.body;
    await pool.execute(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, link_url = ?, position = ?, is_active = ? WHERE id = ?',
      [title, subtitle, imageUrl, linkUrl, position, isActive, id]
    );
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };
