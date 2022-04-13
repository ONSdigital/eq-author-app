import { enableOn } from "utils/featureFlags";

export const EndOfQuestionnaire = "EndOfQuestionnaire";
export const NextPage = "NextPage";
export const Default = "Default";
export const EndOfCurrentSection = "EndOfCurrentSection";

export const destinationKey = {
  [EndOfCurrentSection]: "End of current section",
  [NextPage]: "Next page",
  [Default]: "Select a destination",
  [EndOfQuestionnaire]:
    !enableOn(["removedRoutingDestinations"]) && "End of questionnaire",
};
