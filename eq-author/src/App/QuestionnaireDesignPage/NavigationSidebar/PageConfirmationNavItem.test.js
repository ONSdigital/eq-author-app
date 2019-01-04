import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPageConfirmationNavItem as PageConfirmationNavItem } from "./PageConfirmationNavItem";

describe("PageConfirmationNavItem", () => {
  it("should render", () => {
    const wrapper = shallow(
      <PageConfirmationNavItem
        questionnaireId="1"
        sectionId="2"
        page={{
          id: "3",
          confirmation: {
            id: "4",
            displayName: "Confirmation display name"
          }
        }}
        match={{
          params: {
            questionnaireId: "1",
            tab: "design"
          }
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
