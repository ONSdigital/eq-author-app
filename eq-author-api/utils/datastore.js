const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
} = require("../db/models/DynamoDB");
const { omit, isEqual } = require("lodash");

const saveModel = model =>
  new Promise((resolve, reject) => {
    model.save(err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

const createQuestionnaire = async questionnaire => {
  await saveModel(
    new QuestionnaireModel(omit(questionnaire, "sections", "metadata"))
  );
  await saveModel(
    new QuestionnaireVersionsModel({
      ...questionnaire,
      updatedAt: Date.now(),
    })
  );

  return questionnaire;
};

const saveQuestionnaire = async questionnaire => {
  let equal = isEqual(
    {
      metadata: [],
      sections: [],
      ...questionnaire.originalItem(),
    },
    {
      ...questionnaire,
    }
  );
  if (equal) {
    return questionnaire;
  }
  if (questionnaire.updatedAt) {
    questionnaire.updatedAt = Date.now();
  }

  return saveModel(questionnaire);
};

const deleteQuestionnaire = id => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.delete({ id: id }, function(err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const getQuestionnaire = id => {
  return new Promise((resolve, reject) => {
    QuestionnaireVersionsModel.queryOne({ id: { eq: id } })
      .descending()
      .exec((err, questionnaire) => {
        if (err) {
          reject(err);
        }
        resolve(questionnaire);
      });
  });
};

const listQuestionnaires = () => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.scan()
      .all()
      .exec((err, questionnaires) => {
        if (err) {
          reject(err);
        }
        resolve(questionnaires);
      });
  });
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
