import React from "react";
import { shallow } from "enzyme";
import BaseLayout from "components/BaseLayout";

let wrapper;

const element = document.createElement("div");

describe("components/BaseLayout", () => {
  const questionnaire = { id: "1", title: "Questionnaire" };

  beforeEach(() => {
    jest.spyOn(document, "getElementById").mockImplementation(() => element);
    wrapper = shallow(
      <BaseLayout questionnaire={questionnaire}>Children</BaseLayout>
    );
  });

  it("should render", function() {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a title", function() {
    wrapper.setProps({ title: "Title" });
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
