import { mapMutateToProps } from "./withDuplicateSection";
import { buildSectionPath } from "utils/UrlUtils";

const nextId = previousId => `${parseInt(previousId, 10) + 1}`;

describe("withDuplicateSection", () => {
  let ownProps, history, match, props, mutate, args, result;

  beforeEach(() => {
    match = {
      params: {
        questionnaireId: "1"
      }
    };

    history = {
      replace: jest.fn(),
      push: jest.fn()
    };

    ownProps = {
      history,
      match
    };

    args = {
      questionnaireId: "1",
      sectionId: "1",
      position: 0
    };

    result = {
      data: {
        duplicateSection: {
          id: nextId(args.sectionId),
          position: args.position,
          questionnaire: {
            id: "1",
            __typename: "Questionnaire"
          }
        }
      }
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
          position: args.position
        };

        const expected = {
          variables: { input }
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
        const copiedSectionId = nextId(args.sectionId);

        const expected = buildSectionPath({
          questionnaireId: match.params.questionnaireId,
          sectionId: copiedSectionId
        });

        return props.onDuplicateSection(args).then(() => {
          expect(history.push).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
