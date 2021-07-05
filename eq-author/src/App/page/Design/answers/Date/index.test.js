import React from "react";
import UnwrappedDate from "./";
import { render as rtlRender, screen, fireEvent } from "tests/utils/rtl";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";

const mockUseMutation = jest.fn();

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [mockUseMutation],
}));

describe("Date", () => {
  let answer;
  let onChange;
  let onUpdate;
  let props;
  let multipleAnswers;

  const createWrapper = (props) => {
    return <UnwrappedDate {...props} />;
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
      id: "1",
      answer,
      onChange,
      onUpdate,
      multipleAnswers,
      type: "Date",
    };
  });
  it("should render", () => {
    expect(createWrapper(props)).toMatchSnapshot();
  });

  it("shows missing label error", () => {
    expect(
      buildLabelError(MISSING_LABEL, `${lowerCase(props.type)}`, 8, 7)
    ).toEqual("Enter a date label");
  });

  it("should render Or option toggle ", async () => {
    rtlRender(() => <UnwrappedDate {...props} />);

    screen.getByRole("switch");
  });

  it("should disable Or option toggle if multipleAnswers = true", async () => {
    const { getByTestId } = rtlRender(() => (
      <UnwrappedDate {...props} multipleAnswers />
    ));

    expect(getByTestId("toggle-wrapper")).toHaveAttribute("disabled");
  });

  it("should show Option label if toggle is on", async () => {
    props.answer.options[0].mutuallyExclusive = true;

    const { getByTestId } = rtlRender(() => <UnwrappedDate {...props} />);
    fireEvent.click(getByTestId("toggle-or-option-date-input"), {
      target: { type: "checkbox", checked: true },
    });

    expect(getByTestId("option-label")).toBeInTheDocument();
  });

  it("Can disable the option to have a mutually exclusive", () => {
    const { queryByTestId } = rtlRender(() => (
      <UnwrappedDate {...props} multipleAnswers disableMutuallyExclusive />
    ));

    expect(queryByTestId("toggle-or-option-date")).not.toBeInTheDocument();
  });
});
