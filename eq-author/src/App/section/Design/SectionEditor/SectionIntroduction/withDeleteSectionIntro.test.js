import { mapMutateToProps } from "./withDeleteSectionIntro";

describe("enhancers > withDeleteSectionIntro", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let sectionIntro;
    let ownProps;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      ownProps = {
        raiseToast: jest.fn(() => Promise.resolve()),
      };
      props = mapMutateToProps({ ownProps, mutate });
      sectionIntro = {
        id: 1,
        introductionContent: "bar",
        introductionTitle: "foo",
      };
    });

    it("should have an onUpdateSection prop", () => {
      expect(props.deleteSectionIntro).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.deleteSectionIntro(sectionIntro);
      expect(mutate).toHaveBeenCalledWith({
        variables: {
          input: {
            sectionId: sectionIntro.id,
          },
        },
      });
    });
    it("should raise a toast with old intro object", () => {
      props.deleteSectionIntro(sectionIntro).then(() => {
        expect(ownProps.raiseToast).toHaveBeenCalledWith(
          `Section${sectionIntro.id}`,
          "Section introduction deleted",
          {
            id: sectionIntro.id,
            introductionTitle: sectionIntro.introductionTitle,
            introductionContent: sectionIntro.introductionContent,
          }
        );
      });
    });
  });
});
