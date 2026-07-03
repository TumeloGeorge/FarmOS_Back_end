const repo = require('./cropCycle.repository');

exports.createCropCycle = async (data) => {

  return repo.create(data);

};

exports.getFieldCropCycles = async (fieldId) => {

  return repo.findByField(fieldId);

};

exports.getCropCycle = async (cropCycleId) => {

  return repo.findById(cropCycleId);

};