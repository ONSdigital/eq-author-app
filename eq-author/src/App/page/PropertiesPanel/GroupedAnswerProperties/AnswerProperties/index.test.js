import React from "react";
import { shallow } from "enzyme";

import { NUMBER, DATE } from "constants/answer-types";
import { Required, DateFormat } from "./Properties";
import { UnwrappedAnswerProperties as AnswerProperties } from "./";

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
