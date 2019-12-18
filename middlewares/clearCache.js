const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  await next(); // wait for req handler to finish

  clearHash(req.user.id);
}
