export const EndOfQuestionnaire = "EndOfQuestionnaire";
export const NextPage = "NextPage";
export const Default = "Default";
export const EndOfCurrentSection = "EndOfCurrentSection";
export const SectionSummary = "SectionSummary";

export const logicalDestinations = (altSection = false) => (questionnaire) => ({
  [NextPage]: {
    id: NextPage,
    logicalDestination: NextPage,
    displayName: "Next page",
  },
  [EndOfCurrentSection]: {
    id: EndOfCurrentSection,
    logicalDestination: EndOfCurrentSection,
    displayName: altSection ? "Section summary" : "End of current section",
  },
  [EndOfQuestionnaire]:{ 
    id: EndOfQuestionnaire,
    logicalDestination: EndOfQuestionnaire,
    displayName: "End of questionnaire",
    displayEnabled: !questionnaire.hub,
  }
});
