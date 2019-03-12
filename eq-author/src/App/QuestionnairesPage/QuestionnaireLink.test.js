import React from "react";
import { shallow } from "enzyme";

import QuestionnaireLink from "./QuestionnaireLink";

const questionnaire = {
  id: "1",
  title: "Foo",
  createdAt: "2017/01/02",
  sections: [
    {
      id: "2",
      pages: [{ id: "3" }],
    },
  ],
  createdBy: {
    name: "Alan",
  },
};

describe("QuestionnaireLink", () => {
  it("should render", () => {
    const wrapper = shallow(
      <QuestionnaireLink questionnaire={questionnaire} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
