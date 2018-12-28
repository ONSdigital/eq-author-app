import { mapMutateToProps, createUpdater } from "./withMoveSection";
import fragment from "graphql/fragments/moveSection.graphql";

describe("withMoveSection", () => {
  let ownProps, history, match, props, mutate, args, result;

  beforeEach(() => {
    match = {
      params: {
        questionnaireId: "1"
      }
    };

    history = {
      replace: jest.fn()
    };

    ownProps = {
      history,
      match
    };

    args = {
      from: {
        id: "1",
        position: 0
      },
      to: {
        id: "1",
        position: 1
      }
    };

    result = {
      data: {
        moveSection: {
          id: "1",
          position: 1,
          __typename: "Section"
        }
      }
    };
  });

  describe("mapMutateToProps", () => {
    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(result));
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("supplies an onMoveSection prop", () => {
      expect(props.onMoveSection).toBeInstanceOf(Function);
    });

    describe("onMoveSection", () => {
      it("provides the necessary arguments to mutate", () => {
        const expected = {
          variables: {
            input: {
              ...args.to,
              questionnaireId: match.params.questionnaireId
            }
          },
          optimisticResponse: {
            moveSection: {
              ...args.to,
              questionnaireId: match.params.questionnaireId,
              __typename: "Section"
            }
          },
          update: expect.any(Function)
        };

        return props.onMoveSection(args).then(() => {
          expect(mutate).toHaveBeenCalledWith(expected);
        });
      });

      it("should return promise that resolves to moveSection result", () => {
        return expect(props.onMoveSection(args)).resolves.toBe(result);
      });
    });
  });

  describe("createUpdater", () => {
    let proxy, fromQuestionnaire, toQuestionnaire, section;
    let questionnaireId = "1";

    beforeEach(() => {
      section = { id: "1", position: 0 };

      fromQuestionnaire = {
        id: questionnaireId,
        sections: [section, { id: "2", position: 1 }]
      };

      toQuestionnaire = {
        id: questionnaireId,
        sections: [{ id: "2", position: 0 }, { id: "1", position: 1 }]
      };

      proxy = {
        writeFragment: jest.fn(),
        readFragment: jest.fn()
      };

      proxy.readFragment
        .mockReturnValueOnce(fromQuestionnaire)
        .mockReturnValueOnce(toQuestionnaire);
    });

    it("should update the cache correctly", () => {
      const updater = createUpdater({
        ...args,
        questionnaireId
      });

      updater(proxy, result);

      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: `Questionnaire${questionnaireId}`,
        fragment
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Questionnaire${questionnaireId}`,
        fragment,
        data: toQuestionnaire
      });

      expect(toQuestionnaire.sections[args.to.position]).toMatchObject({
        id: section.id,
        position: args.to.position
      });
    });
  });
});
