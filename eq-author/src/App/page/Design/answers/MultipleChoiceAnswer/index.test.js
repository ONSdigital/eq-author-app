import React from "react";

import { UnwrappedMultipleChoiceAnswer } from "./";
import { render } from "enzyme";
import { CHECKBOX, RADIO, MUTUALLY_EXCLUSIVE } from "constants/answer-types";
import createMockStore from "tests/utils/createMockStore";
import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("useLayoutEffect does nothing on the server", "error");

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));

const createMultipleChoice = (props) => {
  return render(<UnwrappedMultipleChoiceAnswer {...props} />);
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

  it("should render a radio", () => {
    expect(createMultipleChoice(props)).toMatchSnapshot();
  });

  it("should render a checkbox", () => {
    props.answer.type = CHECKBOX;
    props.type = CHECKBOX;
    expect(createMultipleChoice(props)).toMatchSnapshot();
  });

  it("should render a mutually exclusive", () => {
    props.answer.type = MUTUALLY_EXCLUSIVE;
    props.type = MUTUALLY_EXCLUSIVE;
    expect(createMultipleChoice(props)).toMatchSnapshot();
  });
});
