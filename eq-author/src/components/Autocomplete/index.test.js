import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { Autocomplete } from "./";

describe("components/Autocomplete", () => {
  const testId = "autocomplete-input";
  const mocks = {
    updateOption: jest.fn(),
  };
  const Component = props => {
    // need to add props
    // placeholder
    // filter
    // options
    //
    return <Autocomplete {...props} />;
  };

  it("should have dropdown list if filter prop isn't added", () => {});

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
    fireEvent.keyDown(getByTestId(testId), {
      key: "ArrowDown",
      code: "ArrowDown",
    });
    // check the first element in the list is active
    // `list-item-${id}`
    expect(getByTestId()).toHaveStyleRule();

    // not sure if enter if the correct button yet
    fireEvent.keyDown(getByTestId(testId), { key: "Enter", code: "Enter" });
    // this function is what saves the selection of the option
    expect(mocks.updateOption).toHaveBeenCalled();
  });

  it("should dropdown when <input> has text", () => {
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

  it("should not fire space/enter if input is empty", () => {});
  it("should not fire keyboard events when no options available", () => {});
  it("should continue writing to input if space pressed multiple times", () => {});
  it("should reset selected index on input change", () => {
    // type c into the input
    // hit arrow key 5 times
    // hit m
    // hit arrow key once
    // app shouldn't blow up
  });

  it("should output the amount of search results are available from status", () => {
    // including is and are
    // expect(queryByText("8 results available"))
  });

  it("should empty results", () => {
    // expect(queryByText("No search results"))
  });
});
