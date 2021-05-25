import React from "react";
import UnwrappedDate from "./";
import { render as rtlRender, screen, fireEvent } from "tests/utils/rtl";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { lowerCase } from "lodash";


describe("Date", () => {
  let answer;
  let onChange;
  let onUpdate;
  // let children;
  let props;
  let multipleAnswers;

  const createWrapper = (props,) => {
    return (<UnwrappedDate {...props} />);
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
    };
    // children: <div>This is the child component</div>,

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
      // children: <div>This is the child component</div>,
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

  it("should render Or option toggle ", async() => {
    rtlRender(() => <UnwrappedDate {...props} 
    />)

    screen.getByRole('switch')
  });

  it("should show Option label if toggle is on", async () => {
    const { getByTestId } = rtlRender(() => (
      <UnwrappedDate {...props} />
    ));
    fireEvent.click(getByTestId("toggle-or-option-date-input"), {
      target: { type: "checkbox", checked: true },
    });

    expect(getByTestId("option-label")).toBeInTheDocument();
  });
});
