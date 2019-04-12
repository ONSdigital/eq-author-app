import React from "react";
import { shallow } from "enzyme";
import { merge } from "lodash";

import { NUMBER, TEXTFIELD } from "constants/answer-types";

import PropertiesPanel from "./";

const createWrapper = (props, render = shallow) => {
  return render(<PropertiesPanel {...props} />);
};

const questionnaire = {
  id: "1",
  __typename: "Questionnaire",
};

const page = {
  id: "1",
  __typename: "Page",
  type: "Questionnaire",
  answers: [],
};

const props = {
  page,
  questionnaire,
};

describe("PropertiesPanel", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper(props);
  });

  it("should render when there are no answers", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when there are answers", () => {
    const withAnswers = merge({}, props, {
      page: {
        answers: [
          {
            id: "1",
            index: 0,
            type: NUMBER,
            __typename: "Answer",
          },
          {
            id: "2",
            index: 1,
            type: TEXTFIELD,
            __typename: "Answer",
          },
        ],
      },
    });

    wrapper = createWrapper(withAnswers);

    expect(wrapper).toMatchSnapshot();
  });
});
