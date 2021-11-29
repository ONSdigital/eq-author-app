import React from "react";
import { shallow } from "enzyme";

import DurationPreview from "./DurationPreview";

import { DAYS } from "constants/durations";

const render = (props) => shallow(<DurationPreview {...props} />);

describe("Duration Error", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      duration: {
        unit: DAYS,
        value: 5,
      },
    };
    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when value 0", () => {
    const duration = {
      unit: DAYS,
      value: 0,
    };
    expect(render({ duration })).toMatchSnapshot();
  });

  it("should not render when value is null", () => {
    const duration = {
      unit: DAYS,
      value: null,
    };
    expect(render({ duration })).toMatchSnapshot();
  });

  it("should not render when value is undefined", () => {
    const duration = {
      unit: DAYS,
    };
    expect(render({ duration })).toMatchSnapshot();
  });
});
