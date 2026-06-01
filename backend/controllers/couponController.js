
const pool = require('../config/db');

const getCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.execute('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const [coupons] = await pool.execute(
      'SELECT * FROM coupons WHERE code = ? AND active = 1 AND valid_from <= NOW() AND (valid_to IS NULL OR valid_to >= NOW())',
      [code]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    const coupon = coupons[0];
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, validFrom, validTo]
    );

    res.status(201).json({ id: result.insertId, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      active
    } = req.body;

    await pool.execute(
      `UPDATE coupons 
       SET code = ?, discount_type = ?, discount_value = ?, min_order_value = ?, max_discount = ?, 
           usage_limit = ?, valid_from = ?, valid_to = ?, active = ?
       WHERE id = ?`,
      [code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, validFrom, validTo, active, id]
    );

    res.json({ message: 'Coupon updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCoupons, getCouponByCode, createCoupon, updateCoupon, deleteCoupon };
