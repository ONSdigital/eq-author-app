import React from "react";
import { shallow } from "enzyme";

import fakeId from "tests/utils/fakeId";

import { UnwrappedPageConfirmationNavItem as PageConfirmationNavItem } from "./PageConfirmationNavItem";

describe("PageConfirmationNavItem", () => {
  let props;

  beforeEach(() => {
    props = {
      questionnaireId: fakeId("1"),
      sectionId: fakeId("2"),
      page: {
        id: fakeId("3"),
        confirmation: {
          id: fakeId("4"),
          displayName: "Confirmation display name",
        },
      },
      match: {
        params: {
          questionnaireId: fakeId("1"),
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
