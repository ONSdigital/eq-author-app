import { mapMutateToProps, createUpdater } from "./withMovePage";
import { buildPagePath } from "utils/UrlUtils";
import fragment from "graphql/fragments/movePage.graphql";

describe("withMovePage", () => {
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
        sectionId: "1",
        position: 0
      },
      to: {
        id: "1",
        sectionId: "2",
        position: 1
      }
    };

    result = {
      data: {
        movePage: {
          id: args.to.id,
          section: {
            id: args.to.sectionId,
            __typename: "Section"
          },
          position: args.to.position,
          __typename: "QuestionPage"
        }
      }
    };
  });

  describe("mapMutateToProps", () => {
    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve(result));
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("supplies an onMovePage prop", () => {
      expect(props.onMovePage).toBeInstanceOf(Function);
    });

    describe("onMovePage", () => {
      it("provides the necessary arguments to mutate", () => {
        const expected = {
          variables: {
            input: args.to
          },
          optimisticResponse: result.data,
          update: expect.any(Function)
        };

        return props.onMovePage(args).then(() => {
          expect(mutate).toHaveBeenCalledWith(expected);
        });
      });

      it("should return promise that resolves to movePage result", () => {
        return expect(props.onMovePage(args)).resolves.toBe(result);
      });

      it("should redirect if the section id has changed", () => {
        const expected = buildPagePath({
          questionnaireId: match.params.questionnaireId,
          sectionId: args.to.sectionId,
          pageId: args.to.id
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
      page = { id: args.from.id, position: 0 };

      fromSection = {
        id: args.from.sectionId,
        pages: [page, { id: "2", position: 1 }]
      };

      toSection = {
        id: args.to.sectionId,
        pages: [{ id: "3", position: 0 }]
      };

      proxy = {
        writeFragment: jest.fn(),
        readFragment: jest.fn()
      };

      proxy.readFragment
        .mockReturnValueOnce(fromSection)
        .mockReturnValueOnce(toSection);
    });

    it("should update the cache correctly", () => {
      const updater = createUpdater(args);
      updater(proxy, result);

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.from.sectionId}`,
        fragment,
        data: fromSection
      });

      expect(proxy.writeFragment).toHaveBeenCalledWith({
        id: `Section${args.to.sectionId}`,
        fragment,
        data: toSection
      });

      expect(fromSection.pages).not.toContain(page);
      expect(toSection.pages[args.to.position]).toMatchObject({
        id: page.id,
        position: args.to.position
      });
    });

    it("should correctly update position values for all pages in a section", () => {
      const sections = {
        Section1: {
          id: args.from.sectionId,
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
        from: {
          id: "C",
          sectionId: "1",
          position: 2
        },
        to: {
          id: "C",
          sectionId: "1",
          position: 1
        }
      });

      // order: A, C, B
      updater(proxy, {
        data: {
          movePage: {
            id: "C",
            position: 1,
            __typename: "QuestionPage",
            section: {
              id: "1",
              __typename: "Section"
            }
          }
        }
      });

      updater = createUpdater({
        from: {
          id: "B",
          sectionId: "1",
          position: 2
        },
        to: {
          id: "B",
          sectionId: "1",
          position: 0
        }
      });

      // order: B, A, C
      updater(proxy, {
        data: {
          movePage: {
            id: "B",
            position: 0,
            __typename: "QuestionPage",
            section: {
              id: "1",
              __typename: "Section"
            }
          }
        }
      });

      expect(sections.Section1.pages).toEqual([
        { id: "B", position: 0 },
        { id: "A", position: 1 },
        { id: "C", position: 2 }
      ]);
    });
  });
});
