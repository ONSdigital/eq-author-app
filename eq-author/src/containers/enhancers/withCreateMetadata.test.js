import {
  mapMutateToProps,
  createUpdater,
  fragment,
  fragmentName
} from "containers/enhancers/withCreateMetadata";

describe("withCreateMetadata", () => {
  let newMetadata, mutate, result;
  const questionnaire = { id: "1", metadata: [] };

  beforeEach(() => {
    newMetadata = {
      id: "4"
    };

    result = {
      data: {
        createMetadata: newMetadata
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should update the cache", () => {
      const id = `Questionnaire${questionnaire.id}`;
      const readFragment = jest.fn(() => questionnaire);
      const writeFragment = jest.fn();

      const updater = createUpdater(questionnaire.id);

      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment, fragmentName });

      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName,
        data: {
          ...questionnaire,
          metadata: [newMetadata]
        }
      });

      expect(questionnaire.metadata).toContain(newMetadata);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onAddMetadata prop", () => {
      expect(props.onAddMetadata).toBeInstanceOf(Function);
    });

    describe("onAddMetadata", () => {
      it("should call mutate", () => {
        return props.onAddMetadata(questionnaire.id).then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: {
                input: { questionnaireId: questionnaire.id }
              }
            })
          );
        });
      });
    });
  });
});
