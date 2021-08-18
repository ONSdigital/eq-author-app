export const EndOfQuestionnaire = "EndOfQuestionnaire";
export const NextPage = "NextPage";
export const Default = "Default";
export const EndOfCurrentSection = "EndOfCurrentSection";

export const logicalDestinations = (questionnaire) => [
  {
    id: NextPage,
    logicalDestination: NextPage,
    displayName: NextPage,
  },
  {
    id: EndOfCurrentSection,
    logicalDestination: EndOfCurrentSection,
    displayName: EndOfCurrentSection,
  },
  {
    id: EndOfQuestionnaire,
    logicalDestination: EndOfQuestionnaire,
    displayName: EndOfQuestionnaire,
    displayEnabled: !questionnaire.hub,
  },
];
