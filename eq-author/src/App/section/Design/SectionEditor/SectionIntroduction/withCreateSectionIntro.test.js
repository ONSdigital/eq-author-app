import { mapMutateToProps } from "./withCreateSectionIntro";

describe("withCreateSectionIntro", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a createSectionIntro prop", () => {
      expect(props.createSectionIntro).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.createSectionIntro("1");
      expect(mutate).toHaveBeenCalledWith({
        variables: {
          input: {
            sectionId: "1",
            introductionContent: null,
            introductionTitle: null,
          },
        },
      });
    });
  });
});
