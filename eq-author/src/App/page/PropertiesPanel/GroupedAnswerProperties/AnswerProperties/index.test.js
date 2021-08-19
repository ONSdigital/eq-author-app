import React from "react";
import { shallow } from "enzyme";
import { useMutation } from "@apollo/react-hooks";

import { NUMBER, DATE } from "constants/answer-types";
import { DateProperties } from "components/AdditionalContent/AnswerProperties/Answers";
import ToggleProperty from "components/AdditionalContent/ToggleProperty";
import { AnswerProperties } from "./";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual(),
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

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
      onUpdateValidationRule: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<AnswerProperties {...props} />)).toMatchSnapshot();
  });

  describe("behaviour", () => {
    it("should handle change event for 'Required' toggle input", () => {
      const onUpdateAnswer = jest.fn();
      useMutation.mockImplementation(() => [onUpdateAnswer]);
      const wrapper = shallow(<AnswerProperties {...props} />);
      wrapper.find(ToggleProperty).simulate("change", { value: false });
      expect(onUpdateAnswer).toHaveBeenCalledWith({
        variables: {
          input: {
            id: "1",
            properties: {
              decimals: 2,
              required: false,
            },
          },
        },
      });
    });

    it("should handle change event for 'Date Format' number input", () => {
      const onUpdateAnswer = jest.fn();
      useMutation.mockImplementation(() => [onUpdateAnswer]);
      props.answer = {
        id: "1",
        type: DATE,
        properties: {
          required: true,
          format: "dd/mm/yyyy",
        },
        validation: {
          earliestDate: {
            id: "123",
            enabled: false,
            validationType: "earliestDate",
            entityType: "Now",
            offset: {
              value: 0,
              unit: "Days",
            },
            relativePosition: "Before",
          },
          latestDate: {
            id: "456",
            enabled: false,
            validationType: "latestDate",
            entityType: "Now",
            offset: {
              value: 0,
              unit: "Days",
            },
            relativePosition: "After",
          },
          __typename: "",
        },
      };
      const wrapper = shallow(<AnswerProperties {...props} />);
      wrapper.find(DateProperties).simulate("change", { value: "mm/yy" });
      expect(onUpdateAnswer).toHaveBeenCalledWith({
        variables: {
          input: {
            id: "1",
            properties: {
              required: true,
              format: "mm/yy",
            },
          },
        },
      });
    });
  });
});
