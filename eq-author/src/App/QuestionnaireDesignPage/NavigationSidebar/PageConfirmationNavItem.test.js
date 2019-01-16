import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPageConfirmationNavItem as PageConfirmationNavItem } from "./PageConfirmationNavItem";

const createWrapper = props => shallow(<PageConfirmationNavItem {...props} />);

describe("PageConfirmationNavItem", () => {
  let props, wrapper;

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

    wrapper = createWrapper(props);
  });

  it("should render design", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render preview", () => {
    props.match.params.tab = "preview";
    expect(createWrapper({ ...props })).toMatchSnapshot();
  });
});
