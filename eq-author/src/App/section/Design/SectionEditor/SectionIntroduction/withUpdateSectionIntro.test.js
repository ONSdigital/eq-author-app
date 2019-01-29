import { mapMutateToProps } from "./withUpdateSectionIntro";

describe("withUpdateSectionIntro", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateSectionIntro prop", () => {
      expect(props.updateSectionIntro).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.updateSectionIntro({
        id: "1",
        introductionTitle: "foo",
        introductionContent: "bar",
      });
      expect(mutate).toHaveBeenCalledWith({
        variables: {
          input: {
            sectionId: "1",
            introductionTitle: "foo",
            introductionContent: "bar",
          },
        },
      });
    });
  });
});
