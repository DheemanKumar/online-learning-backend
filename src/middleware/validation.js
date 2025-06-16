// Request validation middleware (example for body fields)
module.exports = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ success: false, message: `Missing field: ${field}` });
    }
  }
  next();
};
