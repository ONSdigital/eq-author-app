import { mapResultsToProps, mapPropToOptions } from "./withQuestionnaire";

const page = {
  id: "3",
  title: "My Page"
};
const section = {
  id: "2",
  title: "My Section",
  pages: [page]
};
const questionnaire = {
  id: "1",
  title: "My Questionnaire",
  sections: [section]
};

describe("containers/withQuestionnaire", () => {
  describe("mapResultsToProps", () => {
    it("should select data", () => {
      const props = mapResultsToProps({
        data: { loading: false, questionnaire }
      });

      expect(props).toMatchSnapshot();
    });
  });

  describe("mapOptionsToProps", () => {
    it("should pass questionnaireId as a variable", () => {
      const match = {
        params: { questionnaireId: "1" }
      };
      const options = mapPropToOptions({ match });
      expect(options).toMatchSnapshot();
    });
  });
});
