module.exports = ctx => {
    if (
        ctx.questionnaire &&
        ctx.questionnaire.sections[0] &&
        ctx.questionnaire.sections[0].pages[0]
    ) {
        const nSections = ctx.questionnaire.sections.length;
        const nPages = ctx.questionnaire.sections[nSections - 1].pages.length;

        if (ctx.questionnaire.sections[nSections - 1].pages[nPages - 1] &&
            ctx.questionnaire.sections[nSections - 1].pages[nPages - 1].routing) {
          
            delete ctx.questionnaire.sections[nSections - 1].pages[nPages - 1].routing;
        }
      }
};
