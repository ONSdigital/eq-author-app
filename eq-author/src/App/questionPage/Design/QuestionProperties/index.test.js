import React from "react";
import { shallow } from "enzyme";

import { byTestAttr } from "tests/utils/selectors";

import { UnwrappedQuestionProperties } from "./";

const render = props => shallow(<UnwrappedQuestionProperties {...props} />);

describe("QuestionProperties", () => {
  let props, onUpdatePage, wrapper;

  beforeEach(() => {
    onUpdatePage = jest.fn();
    props = {
      page: {
        id: "1",
      },
      onUpdatePage: onUpdatePage,
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it.each([
    "descriptionEnabled",
    "definitionEnabled",
    "guidanceEnabled",
    "additionalInfoEnabled",
  ])("should correctly call %s change handler", id => {
    let value = {
      name: "foo",
      value: "bar",
    };
    wrapper.find(byTestAttr(id)).simulate("change", value);
    expect(onUpdatePage).toHaveBeenCalledWith({ foo: "bar", id: "1" });
  });
});
