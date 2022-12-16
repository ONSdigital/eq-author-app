import { mapMutateToProps } from "./withUpdateLeftSide";

describe("withUpdateLeftSide", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateLeftSide prop", () => {
      expect(props.updateLeftSide).toBeInstanceOf(Function);
    });

    it("should call mutate for answerId contentType", () => {
      props.updateLeftSide(
        // expression parameter
        {
          id: "id",
          foo: "bar",
        },
        "answer-1", //contentId parameter
        "answerId" //contentType parameter
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { expressionId: "id", answerId: "answer-1" } },
      });
    });

    it("should call mutate for metadataId contentType", () => {
      props.updateLeftSide(
        // expression parameter
        {
          id: "id",
          foo: "bar",
        },
        "metadata-1", //contentId parameter
        "metadataId" //contentType parameter
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { expressionId: "id", metadataId: "metadata-1" } },
      });
    });
  });
});
