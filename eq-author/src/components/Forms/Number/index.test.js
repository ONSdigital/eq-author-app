import React from "react";
import { shallow } from "enzyme";
import Number from "components/Forms/Number";

const defaultValue = 0;

const afterImmediate = () => new Promise(resolve => setImmediate(resolve));

describe("Number", () => {
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

  it("should update UI when changed", () => {
    number.find("[data-test='number-input']").simulate("change", { value: 3 });
    expect(number.find("[data-test='number-input']").prop("value")).toEqual(3);
  });

  it("should call onChange when blurred", () => {
    number.find("[data-test='number-input']").simulate("change", { value: 3 });
    number.find("[data-test='number-input']").simulate("blur");
    expect(handleChange).toHaveBeenCalledWith({
      name: "numberName",
      value: 3
    });
  });

  it("should trigger change and then blur when blurred", cb => {
    number.find("[data-test='number-input']").simulate("change", { value: 5 });
    number.find("[data-test='number-input']").simulate("blur");
    expect(handleChange).toBeCalled();
    return afterImmediate()
      .then(() => {
        expect(handleBlur).toBeCalled();
      })
      .then(cb)
      .catch(cb);
  });

  it("should not call blur if blur not provided", cb => {
    numberWithMinMax
      .find("[data-test='number-input']")
      .simulate("change", { value: 5 });
    numberWithMinMax.find("[data-test='number-input']").simulate("blur");
    expect(handleChange).toBeCalled();
    return afterImmediate()
      .then(() => {
        expect(handleBlur).not.toBeCalled();
      })
      .then(cb)
      .catch(cb);
  });

  describe("min/max", () => {
    it("should not go over the max when changed", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: 101 });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: 100
      });
      expect(
        numberWithMinMax.find("[data-test='number-input']").prop("value")
      ).toEqual(100);
    });

    it("should not go under the min when changed", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: -1 });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: 0
      });
      expect(
        numberWithMinMax.find("[data-test='number-input']").prop("value")
      ).toEqual(0);
    });

    it("should default to min when NaN", () => {
      numberWithMinMax
        .find("[data-test='number-input']")
        .simulate("change", { value: " " });
      numberWithMinMax.find("[data-test='number-input']").simulate("blur");
      expect(handleChange).toBeCalledWith({
        name: "number",
        value: 0
      });
      expect(
        numberWithMinMax.find("[data-test='number-input']").prop("value")
      ).toEqual(0);
    });
  });
});
