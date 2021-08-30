import React from "react";
import DateSingle from "./";
import { render, fireEvent } from "tests/utils/rtl";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

const renderDateSingleProperties = (props = {}) =>
  render(<DateSingle {...props} />);

describe("Date", () => {
  let answer;
  let onChange;
  let onUpdate;
  let props;
  let multipleAnswers;

  const createWrapper = (props) => {
    return <DateSingle {...props} />;
  };

  beforeEach(() => {
    answer = {
      id: "ansID1",
      title: "Date title",
      description: "date description",
      label: "",
      type: "Date",
      guidance: "Guidance",
      secondaryLabel: null,
      secondaryLabelDefault: "",
      properties: {},
      displayName: "",
      qCode: "",
      advancedProperties: true,
      options: [
        {
          id: "option-1",
          label: "option-label",
          mutuallyExclusive: false,
        },
      ],
    };

    onChange = jest.fn();
    onUpdate = jest.fn();
    multipleAnswers = false;

    props = {
      answer,
      onChange,
      onUpdate,
      multipleAnswers,
    };
  });
  it("should render", () => {
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("shows missing label error", () => {
    expect(
      buildLabelError(MISSING_LABEL, `${lowerCase(answer.type)}`, 8, 7)
    ).toEqual("Enter a date label");
  });

  it("should render Or option toggle ", async () => {
    const { getByTestId } = renderDateSingleProperties(props);
    expect(getByTestId("toggle-or-option")).toBeInTheDocument();
  });

  it("should disable Or option toggle if multipleAnswers = true", async () => {
    props.multipleAnswers = true;
    const { getByTestId } = renderDateSingleProperties(props);

    expect(getByTestId("toggle-wrapper")).toHaveAttribute("disabled");
  });

  it("should show Option label if toggle is on", async () => {
    props.answer.options[0].mutuallyExclusive = true;

    const { getByTestId } = renderDateSingleProperties(props);
    fireEvent.click(getByTestId("toggle-or-option-input"), {
      target: { type: "checkbox", checked: true },
    });

    expect(getByTestId("option-label")).toBeInTheDocument();
  });

  // **** unclear what this was testing ******
  // it("Can disable the option to have a mutually exclusive", () => {
  //   props.multipleAnswers = true
  //   const { getByTestId } = renderDateSingleProperties(props)

  //   expect(getByTestId("toggle-or-option")).not.toBeInTheDocument();
  // });
});
