import React from "react";
import { UnwrappedMultipleChoiceAnswer } from "./";
import { render } from "enzyme";
import { CHECKBOX, RADIO } from "constants/answer-types";
import createMockStore from "tests/utils/createMockStore";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

const createMultipleChoice = (props) => {
  render(<UnwrappedMultipleChoiceAnswer {...props} />);
};

describe("radio", () => {
  let answer;
  let props;
  let store;

  beforeEach(() => {
    store = createMockStore();
    answer = {
      id: "ansID1",
      title: "Radio title",
      description: "Radio description",
      label: "",
      type: RADIO,
      guidance: "Guidance",
      secondaryLabel: null,
      secondaryLabelDefault: "",
      properties: {},
      displayName: "",
      qCode: "",
      advancedProperties: true,
      options: [
        {
          id: "1",
          label: "",
          description: "",
        },
      ],
    };

    props = {
      answer,
      onUpdate: jest.fn(),
      onAddOption: jest.fn(),
      onUpdateOption: jest.fn(),
      onDeleteOption: jest.fn(),
      onAddExclusive: jest.fn(),
      onMoveOption: jest.fn(),
      onChange: jest.fn(),
      getValidationError: jest.fn(),
      optionErrorMsg: "",
      errorLabel: "",
      type: RADIO,
      store: store,
    };
  });

  it("should render", () => {
    expect(createMultipleChoice(props)).toMatchSnapshot();
  });
});
