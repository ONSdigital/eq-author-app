import React from "react";
import { shallow } from "enzyme";

import { UnwrappedSkipLogicPage as SkipLogicPage } from "./";

import NoSkipConditions from "./NoSkipConditions";
import SkipLogicEditor from "./SkipLogicEditor";

describe("Skip Condition Page", () => {
  let page;
  beforeEach(() => {
    page = {
      id: "1",
      displayName: "test",
      position: 1,
      section: {
        id: "section-1",
        position: 0,
      },
      folder: {
        id: "folder-1",
        position: 0,
      },
      skipConditions: null,
      validationErrorInfo: { id: "1", errors: [], totalCount: 0 },
    };
  });

  it("should show the no skip condition message when there is no skip conditions for a page", () => {
    const wrapper = shallow(
      <SkipLogicPage page={page} createSkipCondition={jest.fn()} />
    );
    expect(wrapper.find(NoSkipConditions).exists()).toBe(true);
  });

  it("should call create skip condition with the page id when add skip condition button is clicked", () => {
    const createSkipCondition = jest.fn();
    const wrapper = shallow(
      <SkipLogicPage page={page} createSkipCondition={createSkipCondition} />
    );
    wrapper.find(NoSkipConditions).simulate("addSkipCondtions");
    expect(createSkipCondition).toHaveBeenCalledWith("1");
  });

  it("should render the editor when there is a skip condition", () => {
    page.skipConditions = [{ id: "2", expressions: [] }];
    const wrapper = shallow(
      <SkipLogicPage page={page} createSkipCondition={jest.fn()} />
    );
    expect(wrapper.find(SkipLogicEditor).exists()).toBe(true);
    expect(wrapper.find(SkipLogicEditor).props().skipConditions).toMatchObject(
      page.skipConditions
    );
  });

  it("should prevent adding skip conditions on the first page of a questionnaire", () => {
    page.position = 0;
    const wrapper = shallow(
      <SkipLogicPage page={page} createSkipCondition={jest.fn()} />
    );
    expect(wrapper.find(NoSkipConditions).exists()).toBe(true);
    expect(wrapper.find(NoSkipConditions).props().isFirstQuestion).toBe(true);
  });
});
