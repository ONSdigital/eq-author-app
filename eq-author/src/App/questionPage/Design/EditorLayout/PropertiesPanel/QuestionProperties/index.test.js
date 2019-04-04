import React from "react";
import { shallow } from "enzyme";

import { byTestAttr } from "tests/utils/selectors";
import HelpModal from "./HelpModal";
import { UnwrappedQuestionProperties, HelpButton } from "./";

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

  it("should correctly open and close HelpModal", () => {
    wrapper.find(HelpButton).simulate("click");
    expect(wrapper.find(HelpModal).prop("isOpen")).toBeTruthy();

    wrapper.find(HelpModal).simulate("close");
    expect(wrapper.find(HelpModal).prop("isOpen")).toBeFalsy();
  });
});
