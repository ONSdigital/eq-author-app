import React from "react";
import { shallow } from "enzyme";

import PropertiesPanel from "./";

const createWrapper = (props, render = shallow) => {
  return render(<PropertiesPanel {...props} />);
};

const page = {
  id: "1",
  __typename: "Page",
  type: "Questionnaire",
  pageType: "QuestionPage",
};

const props = {
  page,
};

describe("PropertiesPanel", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper(props);
  });

  it("should render when there are no answers", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
