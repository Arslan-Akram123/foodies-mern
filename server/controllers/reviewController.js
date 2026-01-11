const Review = require('../models/reviewModel');

const addReview = async (req, res) => {
  const { food, foodName, rating, comment } = req.body;
  const review = await Review.create({ 
    user: req.user._id, userName: req.user.name, food, foodName, rating, comment 
  });
  res.status(201).json(review);
};

const getReviews = async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });
  res.json(reviews);
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review) { await review.deleteOne(); res.json({ message: 'Deleted' }); }
  else { res.status(404); throw new Error('Not found'); }
};
module.exports = { addReview, getReviews, deleteReview };