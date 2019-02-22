import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPageConfirmationNavItem as PageConfirmationNavItem } from "./PageConfirmationNavItem";

describe("PageConfirmationNavItem", () => {
  let props;

  beforeEach(() => {
    props = {
      questionnaireId: "1",
      sectionId: "2",
      page: {
        id: "3",
        confirmation: {
          id: "4",
          displayName: "Confirmation display name",
        },
      },
      match: {
        params: {
          questionnaireId: "1",
          tab: "design",
        },
      },
    };
  });

  it("should render design", () => {
    expect(shallow(<PageConfirmationNavItem {...props} />)).toMatchSnapshot();
  });

  it("should render preview", () => {
    props.match.params.tab = "preview";
    expect(shallow(<PageConfirmationNavItem {...props} />)).toMatchSnapshot();
  });
});
