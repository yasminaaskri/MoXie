const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');

router.get('/', auth, authorizeRoles('responsable','chef'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/:id', auth, authorizeRoles('responsable','chef'), async (req, res) => {
  const u = await User.findById(req.params.id).select('-password');
  if (!u) return res.status(404).json({ message: 'Not found' });
  res.json(u);
});

router.put('/:id', auth, authorizeRoles('responsable','chef'), async (req, res) => {
  const updates = (({ name, role }) => ({ name, role }))(req.body);
  const u = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  res.json(u);
});

router.delete('/:id', auth, authorizeRoles('responsable'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
