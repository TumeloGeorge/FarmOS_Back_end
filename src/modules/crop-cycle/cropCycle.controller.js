exports.createCropCycle =
async (req,res,next) => {

  try {

    const cycle =
      await service.createCropCycle({

        fieldId: req.params.fieldId,

        ...req.body
      });

    res.status(201).json(cycle);

  } catch(err) {

    next(err);

  }
};

exports.getFieldCropCycles =
async (req,res,next) => {

  try {

    const cycles =
      await service.getFieldCropCycles(
        req.params.fieldId
      );

    res.json(cycles);

  } catch(err){

    next(err);

  }
};