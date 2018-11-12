import {
  mapMutateToProps,
  deleteUpdater,
  fragment
} from "containers/enhancers/withDeleteMetadata";

describe("withDeleteMetadata", () => {
  let metadata, mutate, result, questionnaire;

  beforeEach(() => {
    metadata = {
      id: "1"
    };

    questionnaire = {
      id: "1",
      title: "My Questionnaire",
      metadata: [metadata]
    };

    result = {
      data: {
        withDeleteMetadata: { id: "1" }
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("deleteUpdater", () => {
    it("should remove the metadata from the cache", () => {
      const id = `Questionnaire${questionnaire.id}`;
      const readFragment = jest.fn(() => questionnaire);
      const writeFragment = jest.fn();

      const updater = deleteUpdater(questionnaire.id, metadata.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: questionnaire
      });
      expect(questionnaire.metadata).not.toContain(metadata);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have onDeleteMetadata prop", () => {
      expect(props.onDeleteMetadata).toBeInstanceOf(Function);
    });

    describe("onDeleteMetadata", () => {
      it("should call mutate", () => {
        return props
          .onDeleteMetadata(questionnaire.id, metadata.id)
          .then(() => {
            expect(mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                variables: {
                  input: { id: metadata.id }
                }
              })
            );
          });
      });
    });
  });
});
