import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { Autocomplete } from "./";

describe("components/Autocomplete", () => {
  const testId = "select-test-id";
  const Component = props => {
    return <Autocomplete {...props} />;
  };

  it("should receive focus", () => {
    const { getByTestId } = render(Component());

    getByTestId(testId).focus();

    // add focus styling here
    expect(getByTestId(testId)).toHaveStyleRule();
  });

  it("should be accessible with a keyboard", () => {
    const { getByTestId } = render(Component());

    getByTestId(testId).focus();
    // not sure what the arguments do yet
    // reference an element in the DOM
    // what key I want to press
    fireEvent.keyDown(document.activeElement || document.body, {
      key: "ArrowDown",
      code: "ArrowDown",
    });
    // check the first element in the list is active
    // `list-item-${id}`
    expect(getByTestId()).toHaveStyleRule();

    // not sure if enter if the correct button yet
    fireEvent.keyDown(document.activeElement, { key: "Enter", code: "Enter" });
    // this function is what saves the selection of the option
    expect(someFunc).toHaveBeenCalled();
  });

  it("should dropdown when <select> has text", () => {
    const { queryByTestId } = render(Component());
    // might need a better check to see if the modal is present
    expect(queryByTestId("drop-down-list")).toBeFalsy();

    fireEvent.change(queryByTestId(testId), {
      target: { value: "A" },
    });
    // might need a better check to see if the modal is present
    expect(queryByTestId("drop-down-list")).toBeTruthy();
  });

  it("should return no results", () => {
    const { queryByTestId, queryByText } = render(Component());

    fireEvent.change(queryByTestId(testId), {
      target: { value: "ASDATESCOSAINSBURY" },
    });

    expect(queryByText("No results found")).toBeTruthy();
  });
});
