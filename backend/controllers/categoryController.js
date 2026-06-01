
const pool = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.execute('SELECT * FROM categories WHERE id = ? OR slug = ?', [id, id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(categories[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug, description, image]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;
    await pool.execute(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?',
      [name, slug, description, image, id]
    );
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
