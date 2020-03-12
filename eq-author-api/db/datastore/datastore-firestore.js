const { Firestore } = require("@google-cloud/firestore");
/* eslint-disable no-unused-vars */
let db;
if (process.env.GOOGLE_AUTH_PROJECT_ID) {
  db = new Firestore({
    projectId: process.env.GOOGLE_AUTH_PROJECT_ID,
  });
} else {
  db = new Firestore();
}

const createQuestionnaire = async (questionnaire, ctx) => {
  return questionnaire;
};

module.exports = {
  createQuestionnaire,
};
