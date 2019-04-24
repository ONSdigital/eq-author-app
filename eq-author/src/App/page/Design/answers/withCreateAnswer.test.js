import { mapMutateToProps } from "./withCreateAnswer";

describe("containers/QuestionnaireDesignPage/withCreateAnswer", () => {
  let mutate, result, page, answer;

  beforeEach(() => {
    page = {
      id: "22",
      sectionId: "33",
      title: "New Page",
      answers: [],
    };

    answer = {
      id: "123",
      label: "foo",
      description: "bar",
    };

    result = {
      data: {
        createAnswer: answer,
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("mapMutateToProps", () => {
    let props;
    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onAddAnswer prop", () => {
      expect(props.onAddAnswer).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onAddAnswer(page.id, "Checkbox");

      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: expect.objectContaining({
              questionPageId: page.id,
              type: "Checkbox",
            }),
          },
        })
      );
    });

    it("should unwrap the entity from the apollo result", () => {
      expect(props.onAddAnswer("Checkbox")).resolves.toBe(answer);
    });
  });
});
