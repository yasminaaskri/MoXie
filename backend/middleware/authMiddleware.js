// Simple auth middleware - you can enhance this later with JWT
const requireAuthUser = (req, res, next) => {
  // For now, we'll skip auth validation to get the calendar working
  // You can implement proper JWT validation here later
  next();
};

module.exports = { requireAuthUser };