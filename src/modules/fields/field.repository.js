const db = require('../../db');

exports.create = async (field) => {
  const result = await db.query(
    `
    INSERT INTO fields
    (
      field_id,
      farm_id,
      name,
      size_ha,
      soil_type,
      soil_ph,
      water_source
    )
    VALUES
    (
      gen_random_uuid(),
      $1,$2,$3,$4,$5,$6
    )
    RETURNING *
    `,
    [
      field.farmId,
      field.name,
      field.sizeHa,
      field.soilType,
      field.soilPh,
      field.waterSource
    ]
  );

  return result.rows[0];
};