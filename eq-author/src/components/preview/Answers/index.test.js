import React from "react";
import { shallow } from "enzyme";

import * as AnswerTypes from "constants/answer-types";

import { Answer } from "./";

describe("Answers", () => {
  it("should render a component for each answer type except time", () => {
    Object.values(AnswerTypes).forEach(type => {
      if (
        [AnswerTypes.DATE, AnswerTypes.DATE_RANGE, AnswerTypes.TIME].includes(
          type
        )
      ) {
        return;
      }

      const wrapper = shallow(<Answer answer={{ type, options: [] }} />);
      expect(wrapper).toMatchSnapshot(type);
    });
  });

  it("should render date answers", () => {
    expect(
      shallow(
        <Answer
          answer={{
            properties: { format: "dd/mm/yyyy" },
            type: AnswerTypes.DATE
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
            childAnswers: [{ properties: {} }, { properties: {} }],
            type: AnswerTypes.DATE_RANGE
          }}
        />
      )
    ).toMatchSnapshot();
  });
});
