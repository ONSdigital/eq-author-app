export const EndOfQuestionnaire = "EndOfQuestionnaire";
export const NextPage = "NextPage";
export const Default = "Default";
export const EndOfCurrentSection = "EndOfCurrentSection";

export const logicalDestinations = [
  {
    id: NextPage,
    logicalDestination: NextPage,
    displayName: NextPage,
  },
  {
    id: EndOfQuestionnaire,
    logicalDestination: EndOfQuestionnaire,
    displayName: EndOfQuestionnaire,
  },
];

export const destinationKey = {
  [EndOfQuestionnaire]: "End of questionnaire",
  [EndOfCurrentSection]: "End of current section",
  [NextPage]: "Next page",
  [Default]: "Select a destination",
};
