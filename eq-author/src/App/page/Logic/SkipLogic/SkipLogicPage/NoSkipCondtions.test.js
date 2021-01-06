import React from "react";
import { render, fireEvent, screen } from "tests/utils/rtl";
import NoSkipConditions from "./NoSkipConditions";

describe("components/NoSkipConditions", () => {
  const disabledTitle = "Skip logic not available for this question";
  const disabledParagraph =
    "You can't add skip logic to the first question in a questionnaire.";
  const enabledTitle = "No skip conditions exist for this question";
  const enabledParagraph =
    "All users will see this question if no skip logic is added.";

  it("should render with button disabled", () => {
    const { queryByText } = render(
      <NoSkipConditions onAddSkipConditions={jest.fn()} isFirstQuestion>
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    expect(queryByText(disabledTitle)).toBeTruthy();
    expect(queryByText(disabledParagraph)).toBeTruthy();
    expect(queryByText(enabledTitle)).toBeFalsy();
    expect(queryByText(enabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-skip-condition")).toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should render with button enabled", () => {
    const { queryByText } = render(
      <NoSkipConditions onAddSkipConditions={jest.fn()}>
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    expect(queryByText(enabledTitle)).toBeTruthy();
    expect(queryByText(enabledParagraph)).toBeTruthy();
    expect(queryByText(disabledTitle)).toBeFalsy();
    expect(queryByText(disabledParagraph)).toBeFalsy();

    expect(screen.getByTestId("btn-add-skip-condition")).not.toHaveStyle(
      `pointer-events: none; 
       opacity: 0.6;`
    );
  });

  it("should call onAddSkipConditions when button clicked", () => {
    const onAddSkipConditions = jest.fn();
    const { getByTestId } = render(
      <NoSkipConditions onAddSkipConditions={onAddSkipConditions}>
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    const button = getByTestId("btn-add-skip-condition");
    fireEvent.click(button);
    expect(onAddSkipConditions).toHaveBeenCalledTimes(1);
  });
});
