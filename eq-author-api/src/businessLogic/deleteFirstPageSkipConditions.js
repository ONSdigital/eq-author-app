const { logger } = require("../../utils/logger");

module.exports = (ctx) => {
  if (
    ctx.questionnaire &&
    ctx.questionnaire.sections[0] &&
    ctx.questionnaire.sections[0].folders[0] &&
    ctx.questionnaire.sections[0].folders[0].pages[0] &&
    ctx.questionnaire.sections[0].folders[0].pages[0].skipConditions
  ) {
    logger.info(
      { qid: ctx.questionnaire.id },
      `Removed First Page Skip Conditions ${JSON.stringify(
        ctx.questionnaire.sections[0].folders[0].pages[0].skipConditions
      )}`
    );

    delete ctx.questionnaire.sections[0].folders[0].pages[0].skipConditions;
  }
};
