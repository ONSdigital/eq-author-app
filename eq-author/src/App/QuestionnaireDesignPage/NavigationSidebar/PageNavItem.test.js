import React from "react";
import { shallow } from "enzyme";

import NavLink from "./NavLink";
import { UnwrappedPageNavItem } from "./PageNavItem";

describe("PageNavItem", () => {
  let props;
  beforeEach(() => {
    const page = {
      id: "3",
      displayName: "Page title",
      validationErrorInfo: {
        totalCount: 0,
      },
    };

    const match = {
      params: {
        questionnaireId: "1",
        sectionId: "2",
        pageId: page.id,
      },
    };

    props = {
      questionnaireId: "1",
      sectionId: "2",
      title: "Title",
      page,
      match,
    };
  });

  it("should render", () => {
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should show the original load errors", () => {
    props.page.validationErrorInfo = {
      totalCount: 2,
    };
    props.validations = null;
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper.find(NavLink).props()).toMatchObject({
      errorCount: 2,
    });
  });

  it("should render no validations when the page has no validation info", () => {
    props.page.validationErrorInfo = null;
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper.find(NavLink).props()).toMatchObject({
      errorCount: 0,
    });
  });
});
