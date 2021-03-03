import React from "react";
import { shallow } from "enzyme";

import {
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  TEXTAREA,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
  UNIT,
} from "constants/answer-types";

import { Answer } from "./";

describe("Answers", () => {
  it("should render a component for each answer type", () => {
    [
      CHECKBOX,
      RADIO,
      TEXTFIELD,
      TEXTAREA,
      NUMBER,
      PERCENTAGE,
      UNIT,
      CURRENCY,
    ].forEach((type) => {
      const wrapper = shallow(
        <Answer answer={{ type, properties: {}, options: [] }} />
      );
      expect(wrapper).toMatchSnapshot(type);
    });
  });

  it("should render date answers", () => {
    expect(
      shallow(
        <Answer
          answer={{
            properties: { format: "dd/mm/yyyy" },
            type: DATE,
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("should render date range answers", () => {
    expect(
      shallow(
        <Answer
          answer={{
            properties: {},
            type: DATE_RANGE,
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
