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

  it("should show the original load errors when no validations from context", () => {
    props.page.validationErrorInfo = {
      totalCount: 2,
    };
    props.validations = null;
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper.find(NavLink).props()).toMatchObject({
      errorCount: 2,
    });
  });

  it("should show the context validation errors it has a context", () => {
    props.page.validationErrorInfo = {
      totalCount: 2,
    };
    props.validations = {
      pages: [{ id: props.page.id, errorCount: 1 }],
    };
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper.find(NavLink).props()).toMatchObject({
      errorCount: 1,
    });
  });

  it("should show no errors when the context has validations but not for this page", () => {
    props.page.validationErrorInfo = {
      totalCount: 2,
    };
    props.validations = {
      pages: [],
    };
    const wrapper = shallow(<UnwrappedPageNavItem {...props} />);
    expect(wrapper.find(NavLink).props()).toMatchObject({
      errorCount: 0,
    });
  });
});
