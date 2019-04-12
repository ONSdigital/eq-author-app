import { mapMutateToProps } from "./withDuplicatePage";
import { buildPagePath } from "utils/UrlUtils";

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
          pageId: dupePageId,
        });

        return props.onDuplicatePage(args).then(() => {
          expect(history.push).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
