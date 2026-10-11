const repo = require('../modules/messaging/messaging.repository');

module.exports = async (req, res, next) => {
  const farmId = req.body.farmId || req.query.farmId;
  if (!farmId) return next();

  try {
    const isMember = await repo.isUserInFarm(req.user.user_id, farmId);
    if (!isMember) {
      return res.status(403).json({ error: 'User does not belong to the target farm' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
