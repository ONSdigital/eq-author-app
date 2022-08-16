export const NextPage = "NextPage";
export const Default = "Default";
export const EndOfCurrentSection = "EndOfCurrentSection";

export const logicalDestinations = (altSection = false) => ({
  [NextPage]: {
    id: NextPage,
    logicalDestination: NextPage,
    displayName: "Next page",
  },
  [EndOfCurrentSection]: {
    id: EndOfCurrentSection,
    logicalDestination: EndOfCurrentSection,
    displayName: altSection ? "Section summary" : "End of current section",
  }
});
