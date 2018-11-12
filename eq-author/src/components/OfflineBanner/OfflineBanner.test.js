import React from "react";
import { shallow } from "enzyme";
import { UnconnectedOfflineBanner } from "components/OfflineBanner";

describe("OfflineBanner", () => {
  let createWrapper;

  beforeEach(() => {
    createWrapper = (props, render = shallow) =>
      render(<UnconnectedOfflineBanner {...props} />);
  });
  it("should render if user is offline", () => {
    const wrapper = createWrapper({
      isOffline: true,
      apiError: false,
      hasError: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render if api is offline", () => {
    const wrapper = createWrapper({
      isOffline: false,
      apiError: true,
      hasError: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render when user and api are online", () => {
    const wrapper = createWrapper({
      isOffline: false,
      apiError: false,
      hasError: false
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with user offline error message when user and api are offline", () => {
    const wrapper = createWrapper({
      isOffline: true,
      apiError: true,
      hasError: true
    });
    expect(wrapper).toMatchSnapshot();
  });
});
