import { mapMutateToProps } from "containers/enhancers/withUpdateMetadata";

describe("withUpdateMetadata", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let metadata;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      metadata = jest.fn();
    });

    it("should have an onUpdateMetadata prop", () => {
      expect(props.onUpdateMetadata).toBeInstanceOf(Function);
    });

    describe("onUpdateMetadata", () => {
      it("should call mutate", () => {
        props.onUpdateMetadata(metadata);
        expect(mutate).toHaveBeenCalledWith({
          variables: { input: metadata }
        });
      });
    });
  });
});
