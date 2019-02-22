import { mapMutateToProps, createUpdater } from "./withDuplicatePage";
import { buildPagePath } from "utils/UrlUtils";
import fragment from "graphql/sectionFragment.graphql";

describe("withDuplicatePage", () => {
  let ownProps,
    history,
    match,
    props,
    mutate,
    args,
    result,
    dupePageId,
    sectionId;

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

    sectionId = "2";
    args = {
      sectionId,
      pageId: "3",
      position: 0,
    };

    dupePageId = "4";

    result = {
      data: {
        duplicatePage: {
          id: dupePageId,
          position: args.position,
          __typename: "QuestionPage",
          section: {
            id: sectionId,
            __typename: "Section",
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

    it("supplies an onDuplicatePage prop", () => {
      expect(props.onDuplicatePage).toBeInstanceOf(Function);
    });

    describe("onDuplicatePage", () => {
      it("provides the necessary arguments to mutate", () => {
        const input = {
          id: args.pageId,
          position: args.position,
        };

        const expected = {
          variables: { input },
          update: expect.any(Function),
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
        const expected = buildPagePath({
          questionnaireId: match.params.questionnaireId,
          sectionId: args.sectionId,
          pageId: dupePageId,
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
        pages: [page, { id: "3", position: 1 }],
      };

      proxy = {
        writeFragment: jest.fn(),
        readFragment: jest.fn(),
      };

      proxy.readFragment.mockReturnValueOnce(fromSection);
    });

    it("should update the cache correctly", () => {
      const updater = createUpdater(args);
      updater(proxy, result);

      expect(proxy.readFragment).toHaveBeenCalledWith({
        id: `Section${args.sectionId}`,
        fragment,
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.sectionId}`,
        fragment,
        data: fromSection,
      });

      expect(fromSection.pages[args.position]).toMatchObject({
        id: dupePageId,
        position: args.position,
      });
    });

    it("should correctly update position values for all pages in a section", () => {
      const cacheName = `Section${sectionId}`;
      const pageAId = "a";
      const pageBId = "b";
      const pageCId = "c";
      const sections = {
        [cacheName]: {
          id: args.sectionId,
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
        sectionId,
        position: 2,
      });

      const dupePageId = "d";
      // order: A, C, B
      updater(proxy, {
        data: {
          duplicatePage: {
            id: dupePageId,
            position: 2,
          },
        },
      });

      expect(sections[cacheName].pages).toEqual([
        { id: pageAId, position: 0 },
        { id: pageBId, position: 1 },
        { id: dupePageId, position: 2 },
        { id: pageCId, position: 3 },
      ]);
    });
  });
});
