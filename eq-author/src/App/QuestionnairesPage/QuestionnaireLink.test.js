import React from "react";
import { shallow } from "enzyme";
import fakeId from "tests/utils/fakeId";

import QuestionnaireLink from "./QuestionnaireLink";

const questionnaire = {
  id: fakeId("1"),
  title: "Foo",
  createdAt: "2017/01/02",
  sections: [
    {
      id: fakeId("2"),
      pages: [{ id: fakeId("3") }],
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
