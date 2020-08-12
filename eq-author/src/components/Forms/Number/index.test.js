import React from "react";
import { shallow } from "enzyme";

import { PERCENTAGE, CURRENCY, UNIT } from "constants/answer-types";

import { CENTIMETRES } from "constants/unit-types";

import Number from "./";

const defaultValue = null;

describe("Number", () => {
  jest.useFakeTimers();

  let number;
  let numberWithMinMax;
  let handleChange;
  let handleBlur;

  beforeEach(() => {
    handleChange = jest.fn();
    handleBlur = jest.fn();
    number = shallow(
      <Number
        name="numberName"
        id="number"
        onChange={handleChange}
        onBlur={handleBlur}
        value={defaultValue}
        min={-10}
        max={10}
      />
    );
    numberWithMinMax = shallow(
      <Number
        id="number"
        onChange={handleChange}
        value={defaultValue}
        min={0}
        max={100}
      />
    );
  });

  it("should render correctly", () => {
    expect(number).toMatchSnapshot();
  });

  it("should call onChange when changed", () => {
    number.find("[data-test='number-input']").simulate("change", { value: 3 });
    expect(handleChange).toHaveBeenCalledWith({
      name: "numberName",
      value: 3,
    });
  });

  it("should empty the field when no input provided but then change to default on blur", () => {
    number.find("[data-test='number-input']").simulate("change", { value: "" });
    expect(handleChange).toHaveBeenCalledWith({
      name: "numberName",
      value: null,
    });
    number.setProps({ value: null });
    number.find("[data-test='number-input']").simulate("blur");
    jest.runAllTimers();
    expect(handleChange).toHaveBeenCalledWith({
      name: "numberName",
      value: null,
    });
  });

  it("should trigger change and then blur when blurred", () => {
    number.find("[data-test='number-input']").simulate("change", { value: 5 });
    number.find("[data-test='number-input']").simulate("blur");
    expect(handleChange).toBeCalled();
    expect(handleBlur).not.toBeCalled();
    jest.runAllTimers();
    expect(handleBlur).toBeCalled();
  });

  it("should not call blur if blur not provided", () => {
    numberWithMinMax
      .find("[data-test='number-input']")
      .simulate("change", { value: 5 });
    numberWithMinMax.find("[data-test='number-input']").simulate("blur");
    expect(handleChange).toBeCalled();
    expect(() => {
      jest.runAllTimers();
    }).not.toThrow();
  });

  describe("min/max", () => {
    it("should not go over the max when changed", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: 101 });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: 100,
      });
    });

    it("should not go under the min when changed", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: -1 });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: 0,
      });
    });

    it("should default to min when NaN", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: " " });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: null,
      });
    });

    it("render with a unit type for currency", () => {
      const wrapper = shallow(
        <Number
          name="numberName"
          id="number"
          type={CURRENCY}
          onChange={handleChange}
          onBlur={handleBlur}
          value={defaultValue}
          min={-10}
          max={10}
        />
      );

      expect(wrapper.find("[data-test='unit']")).toMatchSnapshot();
    });

    it("render with a unit type for percentage", () => {
      const wrapper = shallow(
        <Number
          name="numberName"
          id="number"
          type={PERCENTAGE}
          onChange={handleChange}
          onBlur={handleBlur}
          value={defaultValue}
          min={-10}
          max={10}
        />
      );

      expect(wrapper.find("[data-test='unit']")).toMatchSnapshot();
    });

    it("render with a unit type for unit", () => {
      const wrapper = shallow(
        <Number
          name="numberName"
          id="number"
          type={UNIT}
          unit={CENTIMETRES}
          onChange={handleChange}
          onBlur={handleBlur}
          value={defaultValue}
          min={-10}
          max={10}
        />
      );

      expect(wrapper.find("[data-test='unit']")).toMatchSnapshot();
    });
  });
});
