const { QuestionnanaireModel } = require("../db/models/DynamoDB");

const saveQuestionnaire = async questionnaire => {
  await new Promise((resolve, _) => {
    if (questionnaire.updatedAt) {
      questionnaire.updatedAt = Date.now();
    }
    questionnaire.save({}, err => {
      if (err) {
        return console.log(err);
      }
      resolve();
    });
  });
  return questionnaire;
};

const deleteQuestionnaire = async id => {
  await new Promise((resolve, _) => {
    QuestionnanaireModel.delete({ id: id }, function(err) {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
};

module.exports = {
  saveQuestionnaire,
  deleteQuestionnaire,
};
