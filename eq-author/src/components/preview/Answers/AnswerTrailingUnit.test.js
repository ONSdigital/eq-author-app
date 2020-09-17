import React from "react";
import { shallow } from "enzyme";

import { PERCENTAGE, UNIT } from "constants/answer-types";
import { CENTIMETRES } from "constants/unit-types";

import AnswerTrailingUnit from "./AnswerTrailingUnit";

describe("answer with a trailing unit preview", () => {
  it("should render a percentage answer", () => {
    const wrapper = shallow(
      <AnswerTrailingUnit
        answer={{
          label: "Label",
          description: "Description",
          type: PERCENTAGE,
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a unit answer", () => {
    const wrapper = shallow(
      <AnswerTrailingUnit
        answer={{
          label: "Label",
          description: "Description",
          type: UNIT,
          properties: {
            unit: CENTIMETRES,
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a missing unit answer if unit is undefined", () => {
    const wrapper = shallow(
      <AnswerTrailingUnit
        answer={{
          label: "Label",
          description: "Description",
          type: UNIT,
          properties: {
            unit: null,
          },
        }}
      />
    );
    expect(wrapper.find("InputWithUnit").props().unit).toEqual("Missing unit");
  });
});
