import React from "react";
import { render } from "tests/utils/rtl";

import { colors } from "constants/theme";

import CharacterCounter from "./";

const createCharacterCounter = (props = {}) => {
  return render(<CharacterCounter {...props} />);
};

describe("CharacterCounter", () => {
  let props;

  beforeEach(() => {
    props = {
      value: "FooBar",
      limit: 25,
    };
  });

  it("should render", () => {
    expect(createCharacterCounter(props).asFragment()).toMatchSnapshot();
  });

  it("should update counter based on length of value", () => {
    const { getByText } = createCharacterCounter({
      ...props,
      value: "FooBarFooBarFooBar",
    });
    expect(getByText("7")).toBeTruthy();
  });

  it("should update counter with negative count when limit exceeded", () => {
    const { getByText } = createCharacterCounter({
      ...props,
      value: "FooBarFooBarFooBarFooBarFooBarFooBar",
    });
    expect(getByText("-11")).toBeTruthy();
  });

  it("should handle null value", () => {
    const { asFragment } = createCharacterCounter({
      ...props,
      value: null,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correct style when limit exceeded", () => {
    const { getByText } = createCharacterCounter({
      limit: 10,
      value: "FooBarFooBarFooBarFooBarFooBarFooBar",
    });
    expect(getByText("-26")).toHaveStyleRule("color", colors.red);
    expect(getByText("-26")).not.toHaveStyleRule("color", colors.lightGrey);
  });

  it("should render correct style when limit not exceeded", () => {
    const { getByText } = createCharacterCounter({
      ...props,
      value: "",
    });
    expect(getByText("25")).toHaveStyleRule("color", colors.lightGrey);
    expect(getByText("25")).not.toHaveStyleRule("color", colors.red);
  });
});
