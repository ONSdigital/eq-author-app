import React from "react";
import { shallow } from "enzyme";

import NoSkipConditions from "./NoSkipConditions";
import NavigationSidebar from "../../../../QuestionnaireDesignPage/NavigationSidebar";
// src/app/page/logic/skiplogic/skiplogicpage/
// src/app/QuestionnaireDesignPage/NavigationSidebar


describe("components/NoSkipConditions", () => {
  it("should render", () => {
    const wrapper = shallow(
      <NoSkipConditions
        onAddSkipCondtions={jest.fn()}
        title="Test"
        isFirstQuestion={true}>
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onAddSkipConditions when button clicked", () => {
    const onAddSkipCondtions = jest.fn();
    const wrapper = shallow(
      <NoSkipConditions
        onAddSkipCondtions={onAddSkipCondtions}
        title="Test"
        isFirstQuestion={true}>
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    wrapper.find("[data-test='btn-add-skip-condition']").simulate("click");
    expect(onAddSkipCondtions).toHaveBeenCalled();
  });


  
  // NEW TESTS


  // it("should add new page below current page", () => {
  //   wrapper.find(NavigationSidebar).simulate("addQuestionPage");

  //   expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
  //     section.id,
  //     page.position + 1
  //   );
  // });  



});
