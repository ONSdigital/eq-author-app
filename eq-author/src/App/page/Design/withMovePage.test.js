import { mapMutateToProps, createUpdater } from "./withMovePage";
import { buildPagePath } from "utils/UrlUtils";
import fragment from "graphql/fragments/movePage.graphql";

describe("withMovePage", () => {
  let ownProps,
    history,
    match,
    props,
    mutate,
    args,
    result,
    movedPage,
    beforeMoveSection,
    onAddQuestionPage;

  beforeEach(() => {
    movedPage = {
      id: "2",
      section: {
        id: "section1Id",
      },
      position: 0,
    };

    match = {
      params: {
        questionnaireId: "1",
      },
    };

    history = {
      replace: jest.fn(),
    };

    beforeMoveSection = {
      id: "section1Id",
      pages: [],
    };

    onAddQuestionPage = jest.fn(() => Promise.resolve());

    ownProps = {
      history,
      match,
      page: { section: { id: "section1Id" } },
      client: {
        readFragment: jest.fn().mockReturnValueOnce(beforeMoveSection),
      },
      onAddQuestionPage,
    };

    args = {
      from: {
        id: "1",
        sectionId: "1",
        position: 0,
      },
      to: {
        id: "1",
        sectionId: "2",
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
    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(result));
      // handleMove = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("supplies an onMovePage prop", () => {
      expect(props.onMovePage).toBeInstanceOf(Function);
    });

    describe("onMovePage", () => {
      it("provides the necessary arguments to mutate", () => {
        const expected = {
          variables: {
            input: args.to,
          },
          optimisticResponse: result.data,
          update: expect.any(Function),
        };

        return props.onMovePage(args).then(() => {
          expect(mutate).toHaveBeenCalledWith(expected);
        });
      });

      it("should return promise that resolves to movePage result", () => {
        return expect(props.onMovePage(args)).resolves.toBe(result);
      });

      it("should create a page if you move the last page in a section", () => {
        return props.onMovePage(args).then(() => {
          expect(onAddQuestionPage).toHaveBeenCalledWith("section1Id");
        });
      });

      it("should redirect if the section id has changed", () => {
        const expected = buildPagePath({
          questionnaireId: match.params.questionnaireId,
          sectionId: args.to.sectionId,
          pageId: args.to.id,
        });

        return props.onMovePage(args).then(() => {
          expect(history.replace).toHaveBeenCalledWith(expected);
        });
      });
    });
  });

  describe("createUpdater", () => {
    let proxy, fromSection, toSection, page;

    beforeEach(() => {
      page = { id: args.from.id, position: 0, section: { id: "sectionId1" } };

      fromSection = {
        id: args.from.sectionId,
        pages: [page, { id: "2", position: 1 }],
      };

      toSection = {
        id: args.to.sectionId,
        pages: [{ id: "3", position: 0 }],
      };

      proxy = {
        writeFragment: jest.fn(),
        readFragment: jest.fn(),
      };

      proxy.readFragment
        .mockReturnValueOnce(fromSection)
        .mockReturnValueOnce(toSection);
    });

    it("should update the cache correctly", () => {
      const updater = createUpdater(args);
      updater(proxy, result);

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.from.sectionId}`,
        fragment,
        data: fromSection,
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.to.sectionId}`,
        fragment,
        data: toSection,
      });

      expect(fromSection.pages).not.toContain(page);
      expect(toSection.pages[args.to.position]).toMatchObject({
        id: page.id,
        position: args.to.position,
      });
    });

    it("should correctly update position values for all pages in a section", () => {
      const pageAId = "a";
      const pageBId = "b";
      const pageCId = "c";
      const cacheName = `Section${args.from.sectionId}`;
      const sections = {
        [cacheName]: {
          id: args.from.sectionId,
          pages: [
            { id: pageAId, position: 0 },
            { id: pageBId, position: 1 },
            { id: pageCId, position: 2 },
          ],
        },
      };

      proxy = {
        writeFragment: jest.fn(({ id, data }) => {
          sections[id] = data;
        }),
        readFragment: jest.fn(({ id }) => {
          return sections[id];
        }),
      };

      let updater = createUpdater({
        from: {
          id: pageCId,
          sectionId: args.from.sectionId,
          position: 2,
        },
        to: {
          id: pageCId,
          sectionId: args.from.sectionId,
          position: 1,
        },
      });

      // order: A, C, B
      updater(proxy, {
        data: {
          movePage: {
            id: pageCId,
            position: 1,
            __typename: "QuestionPage",
            section: {
              id: args.from.sectionId,
              __typename: "Section",
            },
          },
        },
      });

      updater = createUpdater({
        from: {
          id: pageBId,
          sectionId: args.from.sectionId,
          position: 2,
        },
        to: {
          id: pageBId,
          sectionId: args.from.sectionId,
          position: 0,
        },
      });

      // order: B, A, C
      updater(proxy, {
        data: {
          movePage: {
            id: pageBId,
            position: 0,
            __typename: "QuestionPage",
            section: {
              id: args.from.sectionId,
              __typename: "Section",
            },
          },
        },
      });

      expect(sections[cacheName].pages).toEqual([
        { id: pageBId, position: 0 },
        { id: pageAId, position: 1 },
        { id: pageCId, position: 2 },
      ]);
    });
  });
});
