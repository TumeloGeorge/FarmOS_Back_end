const service = require('./field.service');

exports.createField = async (req,res,next) => {
  try {

    const field =
      await service.createField({
        farmId: req.params.farmId,
        ...req.body
      });

    res.status(201).json(field);

  } catch(err){
    next(err);
  }
};

exports.getFields = async (req, res, next) => {
  try {
    const fields = await service.getFarmFields(req.params.farmId);
    res.json(fields);
  } catch (err) {
    next(err);
  }
};