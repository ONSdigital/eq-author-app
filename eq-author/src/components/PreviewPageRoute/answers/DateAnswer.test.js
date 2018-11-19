import { shallow } from "enzyme";
import React from "react";

import DateAnswer from "./DateAnswer";

describe("Date Answer", () => {
  let answer;

  beforeEach(() => {
    answer = {
      label: "Label",
      description: "Description",
      properties: {
        format: "dd/mm/yyyy"
      }
    };
  });

  it("should render", () => {
    expect(shallow(<DateAnswer answer={answer} />)).toMatchSnapshot();
  });

  it("should not render day input if no day in format", () => {
    answer.properties.format = "mm/yyyy";
    expect(
      shallow(<DateAnswer answer={answer} />).exists('[data-test="day-input"]')
    ).toBeFalsy();
  });

  it("should not render month input if no month in format", () => {
    answer.properties.format = "yyyy";
    expect(
      shallow(<DateAnswer answer={answer} />).exists(
        '[data-test="month-input"]'
      )
    ).toBeFalsy();
  });

  it("should default format to dd/mm/yyyy", () => {
    answer.properties.format = undefined;
    expect(
      shallow(<DateAnswer answer={answer} />).exists('[data-test="day-input"]')
    ).toBeTruthy();
  });
});
