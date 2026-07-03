const repo = require('./field.repository');

exports.createField = async (data) => {
  return repo.create(data);
};

exports.getFarmFields = async (farmId) => {
  return repo.findByFarm(farmId);
};