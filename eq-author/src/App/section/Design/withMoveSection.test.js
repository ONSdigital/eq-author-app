import { mapMutateToProps } from "./withMoveSection";

describe("withMoveSection", () => {
  let ownProps, history, match, props, mutate, args, result;

  beforeEach(() => {
    match = {
      params: {
        questionnaireId: "1",
      },
    };

    history = {
      replace: jest.fn(),
    };

    ownProps = {
      history,
      match,
    };

    args = {
      to: {
        id: "1",
        position: 1,
      },
    };

    result = {
      data: {
        moveSection: {
          id: "1",
          position: 1,
          __typename: "Section",
        },
      },
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
            },
          },
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
});
