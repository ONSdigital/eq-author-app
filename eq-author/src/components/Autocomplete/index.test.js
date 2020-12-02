import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import { Autocomplete } from "./";

import { keyCodes } from "constants/keyCodes";
import { unitConversion } from "constants/unit-types";

const { ArrowDown, ArrowUp } = keyCodes;
const inputId = "autocomplete-input";
const dropDownId = "autocomplete-listbox";
const firstOptionId = "autocomplete-option-0";
const emptyResult = "No results found";
const testList = ["a", "ab", "b", "c"];

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

  it("should receive focus on list item and return to input", () => {
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

    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowUp,
      code: ArrowUp,
    });

    expect(getByTestId(inputId)).toHaveFocus();
  });

  it("should be updateOption with Enter", () => {
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

    userEvent.type(getByTestId(inputId), `{enter}`);

    expect(getByTestId(inputId)).toHaveFocus();
    expect(mocks.updateOption).toHaveBeenCalledTimes(1);
  });

  it("should be updateOption with Space", () => {
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

    userEvent.type(getByTestId(inputId), `{space}`);

    expect(getByTestId(inputId)).toHaveFocus();
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

  it("should reset selected index on input change", async () => {
    const biggerList = ["a", "ab", "abc", "ad", "adc", "afcde", "adam"];
    const newProps = { ...props, options: biggerList };
    const { getByTestId } = render(Component(newProps));

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    expect(getByTestId("autocomplete-option-6")).toBeVisible();

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

    expect(getByTestId(firstOptionId)).toBeVisible();

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

    const { getByTestId } = render(Component(newProps));

    fireEvent.change(getByTestId(inputId), {
      target: { value: "cm" },
    });

    expect(getByTestId(firstOptionId)).toHaveTextContent("Centimetres");
  });

  it("should dropdown option should give input focus on printable key press", () => {
    const { getByTestId } = render(Component(props));

    fireEvent.change(getByTestId(inputId), {
      target: { value: "a" },
    });

    fireEvent.keyDown(getByTestId(inputId), {
      key: ArrowDown,
      code: ArrowDown,
    });

    expect(getByTestId(firstOptionId)).toHaveFocus();

    userEvent.type(getByTestId(firstOptionId), `{backspace}`);

    expect(getByTestId(inputId)).toHaveFocus();
  });
});
