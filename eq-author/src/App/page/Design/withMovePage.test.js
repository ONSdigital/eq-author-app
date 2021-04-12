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
            refetchQueries: expect.any(Object),
          });
        });
      });

      it("refetches source section only when source and destination section differ", () => {
        args.from.sectionId = questionnaire.sections[1].id;

        return props.onMovePage(args).then(() => {
          expect(mutate).toHaveBeenCalledWith({
            ...expected,
            update: expect.any(Function),
            refetchQueries: expect.any(Object),
          });
        });
      });

      it("should remove old item from cache when source and destination section differ", async () => {
        const fromSection = questionnaire.sections[1];
        const proxy = {
          readFragment: () => fromSection,
          writeData: jest.fn(),
        };
        const mockResponse = {
          data: {
            movePage: {
              id: args.to.id,
            },
          },
        };
        let update;

        args.from.sectionId = fromSection.id;

        mutate = (options) => {
          update = options.update;
        };
        await mapMutateToProps({ mutate }).onMovePage(args);

        update(proxy, mockResponse);

        const updatedFromSection = {
          ...fromSection,
          folders: fromSection.folders.map((folder) => ({
            ...folder,
            pages: folder.pages.filter(({ id }) => id !== args.to.id),
          })),
        };

        expect(proxy.writeData).toHaveBeenCalledWith({
          id: `Section${fromSection.id}`,
          data: updatedFromSection,
        });
      });

      it("should return promise that resolves to movePage result", () => {
        return expect(props.onMovePage(args)).resolves.toBe(result);
      });
    });
  });
});
