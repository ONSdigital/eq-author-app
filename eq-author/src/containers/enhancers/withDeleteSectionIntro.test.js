import { mapMutateToProps } from "./withDeleteSectionIntro";

describe("enhancers > withDeleteSectionIntro", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let section;
    let ownProps;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      ownProps = {
        raiseToast: jest.fn(() => Promise.resolve())
      };
      props = mapMutateToProps({ ownProps, mutate });
      section = { id: 1, introductionContent: "bar", introductionTitle: "foo" };
    });

    it("should have an onUpdateSection prop", () => {
      expect(props.onDeleteSectionIntro).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onDeleteSectionIntro(section);
      expect(mutate).toHaveBeenCalledWith({
        variables: {
          input: {
            id: section.id,
            introductionTitle: null,
            introductionContent: null,
            introductionEnabled: false
          }
        }
      });
    });
    it("should raise a toast with old intro object", () => {
      props.onDeleteSectionIntro(section).then(() => {
        expect(ownProps.raiseToast).toHaveBeenCalledWith(
          `Section${section.id}`,
          "Section introduction deleted",
          "undeleteSectionIntroduction",
          {
            id: section.id,
            introductionTitle: section.introductionTitle,
            introductionContent: section.introductionContent,
            introductionEnabled: true
          }
        );
      });
    });
  });
});
