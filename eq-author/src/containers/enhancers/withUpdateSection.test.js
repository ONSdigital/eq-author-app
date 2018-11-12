import { mapMutateToProps } from "./withUpdateSection";

describe("enhancers > withUpdateSection", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let section;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
      section = jest.fn();
    });

    it("should have an onUpdateSection prop", () => {
      expect(props.onUpdateSection).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateSection(section);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: section }
      });
    });
  });
});
