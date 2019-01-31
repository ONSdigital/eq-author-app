const {
  QuestionnanaireModel,
  QuestionnanaireVersionsModel,
} = require("../db/models/DynamoDB");
const { omit, isEqual } = require("lodash");

const createQuestionnaire = async questionnaire => {
  await new Promise((resolve, _) => {
    new QuestionnanaireModel({
      ...omit(questionnaire, "sections", "metadata"),
    }).save({}, err => {
      if (err) {
        return console.log(err);
      }
      new QuestionnanaireVersionsModel({
        ...questionnaire,
        metadata: questionnaire.metadata,
        updatedAt: Date.now(),
      }).save({}, err => {
        if (err) {
          return console.log(err);
        }
        resolve(questionnaire);
      });
    });
  });

  return questionnaire;
};

const saveQuestionnaire = async questionnaire => {
  let equal = isEqual(
    {
      ...questionnaire.originalItem(),
    },
    {
      ...questionnaire,
    }
  );
  if (equal) {
    return questionnaire;
  }
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

const getQuestionnaire = async id => {
  let questionnaire = await new Promise((resolve, _) => {
    QuestionnanaireVersionsModel.queryOne({ id: { eq: id } })
      .descending()
      .exec((err, questionnaire) => {
        if (err) {
          console.log(err);
        }
        resolve(questionnaire);
      });
  });

  return questionnaire;
};

const listQuestionnaires = async () => {
  let questionnaireList = await new Promise((resolve, _) => {
    QuestionnanaireModel.scan()
      .all()
      .exec((err, questionnaires) => {
        if (err) {
          console.log(err);
        }
        resolve(questionnaires);
      });
  });

  return questionnaireList;
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
