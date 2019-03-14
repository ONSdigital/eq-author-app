const addVersion = require("./addVersion");

const migrations = [addVersion];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
