const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");

const migrations = [addVersion, addOptionalFieldProperties];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
