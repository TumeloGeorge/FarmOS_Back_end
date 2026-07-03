const db = require('../../db');

exports.create = async (data) => {
  const result = await db.query(
    `
    INSERT INTO crop_cycles
    (
      crop_cycle_id,
      field_id,
      crop_type,
      variety,
      planting_date,
      expected_harvest_date,
      target_yield
    )
    VALUES
    (
      gen_random_uuid(),
      $1,$2,$3,$4,$5,$6
    )
    RETURNING *
    `,
    [
      data.fieldId,
      data.cropType,
      data.variety,
      data.plantingDate,
      data.expectedHarvestDate,
      data.targetYield
    ]
  );

  return result.rows[0];
};

exports.findByField = async (fieldId) => {

  const result = await db.query(
    `
    SELECT *
    FROM crop_cycles
    WHERE field_id = $1
    ORDER BY planting_date DESC
    `,
    [fieldId]
  );

  return result.rows;
};

exports.findById = async (cropCycleId) => {

  const result = await db.query(
    `
    SELECT *
    FROM crop_cycles
    WHERE crop_cycle_id = $1
    `,
    [cropCycleId]
  );

  return result.rows[0];
};