const Banner = require('../models/bannerModel');
const asyncHandler = require('express-async-handler');
// @desc    Get all banners (Admin sees all, User only Active)
const getBanners = async (req, res) => {
  const query = req.user && req.user.role === 'admin' ? {} : { active: true };
  const banners = await Banner.find(query);
  res.json(banners);
};

// @desc    Create banner (Admin Only)
const createBanner = async (req, res) => {
  const { title, subtitle, image, discountTag, active } = req.body;
  const banner = await Banner.create({ title, subtitle, image, discountTag, active });
  res.status(201).json(banner);
};

// @desc    Update banner (Admin Only)
const updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    Object.assign(banner, req.body);
    const updated = await banner.save();
    res.json(updated);
  } else {
    res.status(404); throw new Error('Banner not found');
  }
};

// @desc    Delete banner (Admin Only)
const deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) { await banner.deleteOne(); res.json({ message: 'Removed' }); }
  else { res.status(404); throw new Error('Not found'); }
};
const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    res.json(banner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

module.exports = { getBanners, createBanner, updateBanner, deleteBanner, getBannerById };