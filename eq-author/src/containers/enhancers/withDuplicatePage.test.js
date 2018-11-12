import { mapMutateToProps, createUpdater } from "./withDuplicatePage";
import { buildPagePath } from "utils/UrlUtils";
import fragment from "graphql/sectionFragment.graphql";

const nextId = previousId => `${parseInt(previousId, 10) + 1}`;

describe("withDuplicatePage", () => {
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
      sectionId: "1",
      pageId: "1",
      position: 0
    };

    result = {
      data: {
        duplicatePage: {
          id: nextId(args.pageId),
          position: args.position,
          __typename: "QuestionPage",
          section: {
            id: "1",
            __typename: "Section"
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

    it("supplies an onDuplicatePage prop", () => {
      expect(props.onDuplicatePage).toBeInstanceOf(Function);
    });

    describe("onDuplicatePage", () => {
      it("provides the necessary arguments to mutate", () => {
        const input = {
          id: args.pageId,
          position: args.position
        };

        const expected = {
          variables: { input },
          update: expect.any(Function)
        };

        return props.onDuplicatePage(args).then(() => {
          expect(mutate).toHaveBeenCalledWith(expected);
        });
      });

      it("should return promise that resolves to duplicatePage result", () => {
        return expect(props.onDuplicatePage(args)).resolves.toBe(
          result.data.duplicatePage
        );
      });

      it("should redirect to new page on copy", () => {
        const copiedPageId = nextId(args.pageId);

        const expected = buildPagePath({
          questionnaireId: match.params.questionnaireId,
          sectionId: args.sectionId,
          pageId: copiedPageId
        });

        return props.onDuplicatePage(args).then(() => {
          expect(history.push).toHaveBeenCalledWith(expected);
        });
      });
    });
  });

  describe("createUpdater", () => {
    let proxy, fromSection, page;

    beforeEach(() => {
      page = { id: args.pageId, position: args.position };

      fromSection = {
        id: args.sectionId,
        pages: [page, { id: "3", position: 1 }]
      };

      proxy = {
        writeFragment: jest.fn(),
        readFragment: jest.fn()
      };

      proxy.readFragment.mockReturnValueOnce(fromSection);
    });

    it("should update the cache correctly", () => {
      const updater = createUpdater(args);
      updater(proxy, result);

      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: `Section${args.sectionId}`,
        fragment
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.sectionId}`,
        fragment,
        data: fromSection
      });

      expect(fromSection.pages[args.position]).toMatchObject({
        id: nextId(args.pageId),
        position: args.position
      });
    });

    it("should correctly update position values for all pages in a section", () => {
      const sections = {
        Section1: {
          id: args.sectionId,
          pages: [
            { id: "A", position: 0 },
            { id: "B", position: 1 },
            { id: "C", position: 2 }
          ]
        }
      };

      proxy = {
        writeFragment: jest.fn(({ id, data }) => {
          sections[id] = data;
        }),
        readFragment: jest.fn(({ id }) => {
          return sections[id];
        })
      };

      let updater = createUpdater({
        sectionId: "1",
        position: 2
      });

      // order: A, C, B
      updater(proxy, {
        data: {
          duplicatePage: {
            id: "D",
            position: 2
          }
        }
      });

      expect(sections.Section1.pages).toEqual([
        { id: "A", position: 0 },
        { id: "B", position: 1 },
        { id: "D", position: 2 },
        { id: "C", position: 3 }
      ]);
    });
  });
});
