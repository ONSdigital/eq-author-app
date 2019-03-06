let datastore;
if (process.env.DATASTORE === "filesystem") {
  datastore = require("./datastoreFileSystem");
} else {
  datastore = require("./datastoreDynamo");
}

const {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
  getUserById,
  getUserBySub,
  createUser,
  updateUser,
} = datastore;

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
  getUserById,
  getUserBySub,
  createUser,
  updateUser,
};
