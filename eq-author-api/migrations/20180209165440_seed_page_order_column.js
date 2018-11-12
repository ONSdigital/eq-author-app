exports.up = function(knex) {
  /**
   * Imagine you have a table like this:
   * 
   *   id   SectionId  
   *  ---- ----------- 
   *    1           1  
   *    2           1  
   *    3           1  
   *    4           2  
   *    5           2  
   *    6           2  
   * 
   * 
   * This query generates a `ROW_NUMBER` (aliased as `position`), partitioned by `SectionId`, and ordered by `id`:
   * 
   *   id   SectionId   position  
   *  ---- ----------- ---------- 
   *    1           1          1  
   *    2           1          2  
   *    3           1          3  
   *    4           2          1  
   *    5           2          2  
   *    6           2          3  
   * 
   * 
   * The `position` value is multiplied by 1000 to gives spaced values for the `order` column.
   * Each row is then updated with it's corresponding `order` value.
   * 
   */
  return knex.raw(`
    UPDATE "Pages"
    SET "order" = p.position
    FROM (
      SELECT id, ROW_NUMBER () OVER (
        PARTITION BY "SectionId"
        ORDER BY id
      ) * 1000 as "position"
      FROM "Pages"
    ) p
    WHERE "Pages".id = p.id;
  `);
};

exports.down = function(knex) {
  return knex("Pages").update({ order: 0 });
};
