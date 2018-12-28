import React from "react";
import { shallow } from "enzyme";
import Duration from "App/QuestionPage/Design/Validation/Date/Duration";
import { Number, Select } from "components/Forms";

import { DAYS, MONTHS, YEARS } from "constants/durations";
const UNITS = [DAYS, MONTHS, YEARS];

const render = props => shallow(<Duration {...props} />);

describe("Duration", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      name: "foobar",
      duration: {
        value: 3,
        unit: YEARS
      },
      units: UNITS,
      onChange: jest.fn(),
      onUpdate: jest.fn()
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly change and update duration value", () => {
    const value = wrapper.find(Number);
    value.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    value.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });

  it("should correctly change and update duration unit", () => {
    const value = wrapper.find(Select);
    value.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    value.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });
});
