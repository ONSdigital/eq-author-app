import React from "react";
import { shallow } from "enzyme";

import { useMutation } from "@apollo/react-hooks";

import NumberProperties from "./NumberProperties";

const createWrapper = (props = {}, render = shallow) => {
  return render(<NumberProperties {...props} />);
};

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));
useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

describe("Required Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "number",
        properties: {
          decimals: 0,
        },
        validationErrorInfo: {
          totalCount: 0,
          errors: [],
          id: "1",
        },
      },
      onChange: jest.fn(),
      getId: jest.fn(),
    };

    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    const updateAnswersOfType = jest.fn();
    useMutation.mockImplementation(() => [updateAnswersOfType]);
    expect(wrapper).toMatchSnapshot();
  });
});
