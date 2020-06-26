import React from "react";
import { shallow } from "enzyme";

import { UnwrappedSkipLogicPage as SkipLogicPage } from "./";

import NoSkipConditions from "./NoSkipConditions";
import SkipLogicEditor from "./SkipLogicEditor";

describe("Skip Condition Page", () => {
  it("should show the no skip condition message when there is no skip conditions for a page", () => {
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", skipConditions: null }}
        createSkipCondition={jest.fn()}
      />
    );
    expect(wrapper.find(NoSkipConditions).exists()).toBe(true);
  });

  it("should call create skip sondition with the page id when add skip sondition button is clicked", () => {
    const createSkipCondition = jest.fn();
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", skipConditions: null }}
        createSkipCondition={createSkipCondition}
      />
    );
    wrapper.find(NoSkipConditions).simulate("addSkipCondtions");
    expect(createSkipCondition).toHaveBeenCalledWith("1");
  });

  it("should render the editor when there is a skip condition", () => {
    const skipConditions = [{ id: "2", expressions: [] }];
    const wrapper = shallow(
      <SkipLogicPage
        page={{ id: "1", displayName: "test", skipConditions }}
        createSkipCondition={jest.fn()}
      />
    );
    expect(wrapper.find(SkipLogicEditor).exists()).toBe(true);
    expect(
      wrapper.find(SkipLogicEditor).props().page.skipConditions
    ).toMatchObject(skipConditions);
  });
});
