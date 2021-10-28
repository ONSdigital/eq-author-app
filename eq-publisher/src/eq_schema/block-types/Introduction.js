const { flow } = require("lodash");
const convertPipes = require("../../utils/convertPipes");
const {
  parseContent,
  getInnerHTMLWithPiping,
} = require("../../utils/HTMLUtils");

const processContent = (ctx) => flow(convertPipes(ctx), parseContent);

const getSimpleText = (content, ctx) =>
  flow(convertPipes(ctx), getInnerHTMLWithPiping)(content);

const addPanel = (additionalGuidancePanel) =>
  `<div class='panel panel--simple panel--info'><div class='panel__body'>${additionalGuidancePanel}</div></div>`;

const getComplexText =
  (content, ctx) =>
  (additionalGuidancePanel, additionalGuidancePanelSwitch) => {
    const result = processContent(ctx)(content);
    if (result) {
      if (additionalGuidancePanel && additionalGuidancePanelSwitch) {
        result.content.unshift({
          description: addPanel(additionalGuidancePanel),
        });
        return result.content;
      } else {
        return result.content;
      }
    }

    return undefined;
  };

module.exports = class Introduction {
  constructor(
    {
      description,
      contactDetailsPanel,
      contactDetailsPanelSwitch,
      additionalGuidancePanel,
      additionalGuidancePanelSwitch,
      secondaryTitle,
      secondaryDescription,
      collapsibles,
      tertiaryTitle,
      tertiaryDescription,
    },
    ctx
  ) {
    this.type = "Introduction";
    this.id = "introduction-block";
    this.primary_content = [
      {
        type: "Basic",
        id: "primary",
        content: getComplexText(description, ctx)(
          contactDetailsPanel,
          contactDetailsPanelSwitch,
          additionalGuidancePanel,
          additionalGuidancePanelSwitch
        ),
      },
    ];

    this.preview_content = {
      id: "preview",
      title: getSimpleText(secondaryTitle, ctx),
      content: getComplexText(secondaryDescription, ctx)(),
      questions: collapsibles
        .filter((collapsible) => collapsible.title && collapsible.description)
        .map(({ title, description }) => ({
          question: title,
          content: getComplexText(description, ctx)(),
        })),
    };

    this.secondary_content = [
      {
        id: "secondary-content",
        title: getSimpleText(tertiaryTitle, ctx),
        content: getComplexText(tertiaryDescription, ctx)(),
      },
    ];
  }
};
