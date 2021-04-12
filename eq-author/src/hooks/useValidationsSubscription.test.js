import { useSubscription } from "@apollo/react-hooks";
import useValidationsSubscription from "hooks/useValidationsSubscription";
import VALIDATIONS_SUBSCRIPTION from "graphql/validationsSubscription.graphql";

jest.mock("@apollo/react-hooks", () => ({
  useSubscription: jest.fn(),
}));

describe("useValidationsSubscription", () => {
  it("should wrap input id in graphql json", () => {
    const questionnaireId = "42";
    useValidationsSubscription({ id: questionnaireId });
    expect(useSubscription).toHaveBeenCalledWith(
      VALIDATIONS_SUBSCRIPTION,
      expect.objectContaining({
        variables: {
          id: questionnaireId,
        },
      })
    );
  });
});
