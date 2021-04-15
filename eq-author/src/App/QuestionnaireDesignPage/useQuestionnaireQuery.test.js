import { useQuery } from "@apollo/react-hooks";
import useQuestionnaireQuery from "./useQuestionnaireQuery";
import QUESTIONNAIRE_QUERY from "./getQuestionnaireQuery.graphql";

jest.mock("@apollo/react-hooks", () => ({
  useQuery: jest.fn(),
}));

describe("useQuestionnaireQuery", () => {
  it("should wrap input id in graphql json", () => {
    const questionnaireId = "42";
    useQuestionnaireQuery(questionnaireId);

    expect(useQuery).toHaveBeenCalledWith(
      QUESTIONNAIRE_QUERY,
      expect.objectContaining({
        variables: {
          input: {
            questionnaireId,
          },
        },
      })
    );
  });
});
