exports.up = function(knex) {
  let promiseArray = [];

  promiseArray.push(
    knex.schema.table("Answers", t => {
      t.renameColumn("created_at", "createdAt");
      t.renameColumn("updated_at", "updatedAt");
    })
  );

  promiseArray.push(
    knex.schema.table("Options", t => {
      t.renameColumn("created_at", "createdAt");
      t.renameColumn("updated_at", "updatedAt");
    })
  );

  promiseArray.push(
    knex.schema.table("Pages", t => {
      t.renameColumn("created_at", "createdAt");
      t.renameColumn("updated_at", "updatedAt");
    })
  );

  promiseArray.push(
    knex.schema.table("Questionnaires", t => {
      t.renameColumn("created_at", "createdAt");
      t.renameColumn("updated_at", "updatedAt");
    })
  );

  promiseArray.push(
    knex.schema.table("Sections", t => {
      t.renameColumn("created_at", "createdAt");
      t.renameColumn("updated_at", "updatedAt");
    })
  );

  return Promise.all(promiseArray);
};

exports.down = function(knex) {
  let promiseArray = [];

  promiseArray.push(
    knex.schema.table("Answers", t => {
      t.renameColumn("createdAt", "created_at");
      t.renameColumn("updatedAt", "updated_at");
    })
  );

  promiseArray.push(
    knex.schema.table("Options", t => {
      t.renameColumn("createdAt", "created_at");
      t.renameColumn("updatedAt", "updated_at");
    })
  );

  promiseArray.push(
    knex.schema.table("Pages", t => {
      t.renameColumn("createdAt", "created_at");
      t.renameColumn("updatedAt", "updated_at");
    })
  );

  promiseArray.push(
    knex.schema.table("Questionnaires", t => {
      t.renameColumn("createdAt", "created_at");
      t.renameColumn("updatedAt", "updated_at");
    })
  );

  promiseArray.push(
    knex.schema.table("Sections", t => {
      t.renameColumn("createdAt", "created_at");
      t.renameColumn("updatedAt", "updated_at");
    })
  );

  return Promise.all(promiseArray);
};
