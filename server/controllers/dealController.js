const Deal = require('../models/dealModel');

const getDeals = async (req, res) => {
  const query = req.user && req.user.role === 'admin' ? {} : { active: true };
  const deals = await Deal.find(query);
  res.json(deals);
};

const createDeal = async (req, res) => {
  const deal = await Deal.create(req.body);
  res.status(201).json(deal);
};

const updateDeal = async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (deal) {
    Object.assign(deal, req.body);
    const updated = await deal.save();
    res.json(updated);
  } else {
    res.status(404); throw new Error('Deal not found');
  }
};

const deleteDeal = async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (deal) { await deal.deleteOne(); res.json({ message: 'Removed' }); }
  else { res.status(404); throw new Error('Not found'); }
};

module.exports = { getDeals, createDeal, updateDeal, deleteDeal };