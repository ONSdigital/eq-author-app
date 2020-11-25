import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { Autocomplete } from "./";

import { keyCodes } from "constants/keyCodes";
import { unitConversion } from "constants/unit-types";

const { Enter, Space, ArrowDown } = keyCodes;
const inputId = "autocomplete-input";
const dropDownId = "autocomplete-listbox";
const firstOptionId = "autocomplete-option-0";
const emptyResult = "No results found";
const testList = ["a", "b", "c"];

const filter = (options, query) =>
  Object.values(options)
    .filter(
      x =>
        x.unit.toLowerCase().includes(query) ||
        x.abbreviation.toLowerCase().includes(query)
    )
    .map(
      option => `${option.unit}
     ${option.abbreviation}`
    );

describe("components/Autocomplete", () => {
  let props, mocks;

  const Component = props => {
    return <Autocomplete {...props} />;
  };

  beforeEach(() => {
    mocks = {
      updateOption: jest.fn(),
    };

    props = {
      placeholder: "Holding place",
      options: testList,
      defaultValue: "",
      ...mocks,
    };
  });

  it("should have dropdown list if filter prop isn't added", () => {
    const { getByTestId, queryByTestId } = render(Component(props));

    getByTestId(inputId).focus();
    expect(queryByTestId(dropDownId)).toBeNull();

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    expect(getByTestId(dropDownId)).toBeVisible();
  });

  it("should receive focus and navigate to first option", () => {
    const { getByTestId } = render(Component(props));

    const input = getByTestId(inputId);

    input.focus();

    expect(input).toHaveFocus();

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowDown,
      code: ArrowDown,
    });

    expect(getByTestId(firstOptionId)).toHaveFocus();
  });

  it("should be accessible with a keyboard", () => {
    const { getByTestId } = render(Component(props));

    getByTestId(inputId).focus();

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowDown,
      code: ArrowDown,
    });

    expect(getByTestId(firstOptionId)).toHaveFocus();

    fireEvent.keyDown(getByTestId(inputId), { key: Enter, code: Enter });

    expect(getByTestId(inputId)).not.toHaveFocus();
    expect(mocks.updateOption).toHaveBeenCalledTimes(1);
  });

  it("should return no results", () => {
    const { queryByTestId, queryByText } = render(Component(props));

    expect(queryByText(emptyResult)).toBeNull();

    fireEvent.change(queryByTestId(inputId), {
      target: { value: "ASDATESCOSAINSBURY" },
    });

    expect(queryByText(emptyResult)).toBeTruthy();
  });

  it("should not fire space/enter if input is empty", () => {
    const { getByTestId } = render(Component(props));

    expect(getByTestId(inputId).value).toEqual("");

    const keysToTest = [
      { key: Enter, code: Enter },
      { key: Space, code: Space },
    ];

    keysToTest.forEach(key => {
      getByTestId(inputId).focus();
      fireEvent.keyDown(getByTestId(inputId), key);
      expect(mocks.updateOption).toHaveBeenCalledTimes(0);
    });
  });

  it("should not fire keyboard events when no options available", () => {
    // this test needs some thinking
    const { getByTestId, queryByText } = render(Component(props));

    expect(queryByText(emptyResult)).toBeNull();

    const keysToTest = [
      { key: Enter, code: Enter },
      { key: Space, code: Space },
    ];

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    keysToTest.forEach(key => {
      getByTestId(firstOptionId).focus();
      fireEvent.keyDown(getByTestId(inputId), key);
      expect(mocks.updateOption).toHaveBeenCalledTimes(0);
    });
  });

  it("should reset selected index on input change", () => {
    const biggerList = ["a", "ab", "abc", "ad", "adc", "afcde", "adam"];
    const newProps = { ...props, options: biggerList };
    const { getByTestId, getByRole } = render(Component(newProps));

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    expect(getByRole("status")).toHaveTextContent("7 results are available");

    [1, 2, 3, 4, 5].forEach(() => {
      fireEvent.keyDown(getByTestId(inputId), {
        key: ArrowDown,
        code: ArrowDown,
      });
    });

    const optionFour = getByTestId("autocomplete-option-4");

    expect(optionFour).toHaveFocus();

    fireEvent.change(getByTestId(inputId), {
      target: { value: "ada" },
    });

    expect(getByRole("status")).toHaveTextContent("1 result is available");

    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowDown,
      code: ArrowDown,
    });

    expect(getByTestId(firstOptionId)).toHaveFocus();
    expect(getByTestId(firstOptionId) === optionFour).toBeFalsy();
  });

  it("should apply filter to options", () => {
    const newProps = {
      ...props,
      options: unitConversion,
      filter,
    };

    const { getByTestId, getByRole } = render(Component(newProps));

    fireEvent.change(getByTestId(inputId), {
      target: { value: "cm" },
    });

    expect(getByRole("status")).toHaveTextContent("3 results are available");
    expect(getByTestId(firstOptionId)).toHaveTextContent("Centimetres");
  });
});
