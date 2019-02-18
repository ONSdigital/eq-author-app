import { mapMutateToProps } from "./withDuplicateSection";
import { buildSectionPath } from "utils/UrlUtils";

describe("withDuplicateSection", () => {
  let ownProps, history, match, props, mutate, args, result, dupeSectionId;

  beforeEach(() => {
    match = {
      params: {
        questionnaireId: "1",
      },
    };

    history = {
      replace: jest.fn(),
      push: jest.fn(),
    };

    ownProps = {
      history,
      match,
    };

    args = {
      questionnaireId: "3",
      sectionId: "2",
      position: 0,
    };

    dupeSectionId = "4";

    result = {
      data: {
        duplicateSection: {
          id: dupeSectionId,
          position: args.position,
          questionnaire: {
            id: "1",
            __typename: "Questionnaire",
          },
        },
      },
    };
  });

  describe("mapMutateToProps", () => {
    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(result));
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("supplies an onDuplicateSection prop", () => {
      expect(props.onDuplicateSection).toBeInstanceOf(Function);
    });

    describe("onDuplicateSection", () => {
      it("provides the necessary arguments to mutate", () => {
        const input = {
          id: args.sectionId,
          position: args.position,
        };

        const expected = {
          variables: { input },
        };

        return props.onDuplicateSection(args).then(() => {
          expect(mutate).toHaveBeenCalledWith(expected);
        });
      });

      it("should return promise that resolves to duplicateSection result", () => {
        return expect(props.onDuplicateSection(args)).resolves.toBe(
          result.data.duplicateSection
        );
      });

      it("should redirect to new section on copy", () => {
        const expected = buildSectionPath({
          questionnaireId: match.params.questionnaireId,
          sectionId: dupeSectionId,
        });

        return props.onDuplicateSection(args).then(() => {
          expect(history.push).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
