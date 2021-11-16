import { mapMutateToProps } from "./withMovePage";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

describe("withMovePage", () => {
  let props, mutate, args, result, questionnaire;

  beforeEach(() => {
    questionnaire = buildQuestionnaire({
      sectionCount: 2,
      pageCount: 2,
    });

    args = {
      from: {
        sectionId: questionnaire.sections[0].id,
        position: 0,
      },
      to: {
        id: questionnaire.sections[0].folders[0].pages[0].id,
        sectionId: questionnaire.sections[0].id,
        position: 1,
      },
    };

    result = {
      data: {
        movePage: {
          id: args.to.id,
          section: {
            id: args.to.sectionId,
            __typename: "Section",
          },
          position: args.to.position,
          __typename: "QuestionPage",
        },
      },
    };
  });

  describe("mapMutateToProps", () => {
    let expected;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(result));
      props = mapMutateToProps({ mutate });
      expected = {
        variables: { input: args.to },
      };
    });

    it("supplies an onMovePage prop", () => {
      expect(props.onMovePage).toBeInstanceOf(Function);
    });

    describe("onMovePage", () => {
      it("provides the necessary arguments to mutate", () => {
        return props.onMovePage(args).then(() => {
          expect(mutate).toHaveBeenCalledWith({
            ...expected,
          });
        });
      });

      it("should return promise that resolves to movePage result", () => {
        return expect(props.onMovePage(args)).resolves.toBe(result);
      });
    });
  });
});
