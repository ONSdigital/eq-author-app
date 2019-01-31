import React from "react";
import { shallow } from "enzyme";

import { NUMBER, DATE, PERCENTAGE, CURRENCY } from "constants/answer-types";
import { Decimal, Required, DateFormat } from "./Properties";
import AnswerProperties from "./";

describe("Answer Properties", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        properties: {
          required: true,
          decimals: 2,
        },
      },
      loading: false,
      onUpdateAnswer: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<AnswerProperties {...props} />)).toMatchSnapshot();
  });

  describe("behaviour", () => {
    it("should handle change event for 'Required' toggle input", () => {
      const wrapper = shallow(<AnswerProperties {...props} />);
      wrapper.find(Required).simulate("change", { value: false });
      expect(props.onUpdateAnswer).toHaveBeenCalledWith({
        id: "1",
        properties: {
          decimals: 2,
          required: false,
        },
      });
    });

    describe("decimals", () => {
      it("should handle change event for 'Decimals' number input when answer type is number", () => {
        const wrapper = shallow(<AnswerProperties {...props} />);
        wrapper.find(Decimal).simulate("change", { value: 3 });
        expect(props.onUpdateAnswer).toHaveBeenCalledWith({
          id: "1",
          properties: {
            required: true,
            decimals: 3,
          },
        });
      });

      it("should handle change event for 'Decimals' number input when answer type is percentage", () => {
        props.answer.type = PERCENTAGE;
        const wrapper = shallow(<AnswerProperties {...props} />);
        wrapper.find(Decimal).simulate("change", { value: 4 });
        expect(props.onUpdateAnswer).toHaveBeenCalledWith({
          id: "1",
          properties: {
            required: true,
            decimals: 4,
          },
        });
      });

      it("should handle change event for 'Decimals' number input when answer type is currency", () => {
        props.answer.type = CURRENCY;
        const wrapper = shallow(<AnswerProperties {...props} />);
        wrapper.find(Decimal).simulate("change", { value: 4 });
        expect(props.onUpdateAnswer).toHaveBeenCalledWith({
          id: "1",
          properties: {
            required: true,
            decimals: 4,
          },
        });
      });
    });

    it("should handle change event for 'Date Format' number input", () => {
      props.answer = {
        id: "1",
        type: DATE,
        properties: {
          required: true,
          format: "dd/mm/yyyy",
        },
      };
      const wrapper = shallow(<AnswerProperties {...props} />);
      wrapper.find(DateFormat).simulate("change", { value: "mm/yy" });
      expect(props.onUpdateAnswer).toHaveBeenCalledWith({
        id: "1",
        properties: {
          required: true,
          format: "mm/yy",
        },
      });
    });
  });
});
