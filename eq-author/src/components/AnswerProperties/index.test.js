import React from "react";
import { NUMBER, DATE } from "constants/answer-types";
import { Decimal, Required, DateFormat } from "./Properties";

import AnswerProperties from "components/AnswerProperties";
import { shallow } from "enzyme";

let wrapper;
let handleUpdate;
let handleSubmit;
let handleChange;

let answerProperties;

let answer = {
  id: "1",
  type: NUMBER,
  properties: {
    required: true,
    decimals: 2
  }
};

describe("Answer Properties", () => {
  beforeEach(() => {
    handleUpdate = jest.fn();
    handleSubmit = jest.fn();
    handleChange = jest.fn();

    answerProperties = (props = {}) => (
      <AnswerProperties
        answer={answer}
        onUpdate={handleUpdate}
        loading={false}
        onSubmit={handleSubmit}
        onUpdateAnswer={handleChange}
        {...props}
      />
    );

    wrapper = shallow(answerProperties());
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("behaviour", () => {
    it("should handle change event for 'Required' toggle input", () => {
      wrapper.find(Required).simulate("change", { value: false });
      expect(handleChange).toHaveBeenCalledWith({
        id: "1",
        properties: {
          decimals: 2,
          required: false
        }
      });
    });

    it("should handle change event for 'Decimals' number input", () => {
      wrapper.find(Decimal).simulate("change", { value: 3 });
      expect(handleChange).toHaveBeenCalledWith({
        id: "1",
        properties: {
          required: true,
          decimals: 3
        }
      });
    });

    it("should handle change event for 'Date Format' number input", () => {
      wrapper = shallow(
        answerProperties({
          answer: {
            id: "1",
            type: DATE,
            properties: {
              required: true,
              format: "dd/mm/yyyy"
            }
          }
        })
      );

      wrapper.find(DateFormat).simulate("change", { value: "mm/yy" });
      expect(handleChange).toHaveBeenCalledWith({
        id: "1",
        properties: {
          required: true,
          format: "mm/yy"
        }
      });
    });
  });
});
