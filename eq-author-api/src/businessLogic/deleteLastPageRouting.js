module.exports = ctx => {
    if (
        ctx.questionnaire &&
        ctx.questionnaire.sections[0] &&
        ctx.questionnaire.sections[0].pages[0]
    ) {
        const sections = ctx.questionnaire.sections.length;
        const pages = ctx.questionnaire.sections[sections - 1].pages.length;

        if (ctx.questionnaire.sections[sections - 1].pages[pages - 1] &&
            ctx.questionnaire.sections[sections - 1].pages[pages - 1].routing) {
          
            delete ctx.questionnaire.sections[sections - 1].pages[pages - 1].routing;
        }
      }
};
