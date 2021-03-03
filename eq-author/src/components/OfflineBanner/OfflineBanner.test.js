import React from "react";
import { render } from "tests/utils/rtl";
import { UnconnectedOfflineBanner } from "components/OfflineBanner";

describe("OfflineBanner", () => {
  let renderComponent;

  beforeEach(() => {
    renderComponent = (props) =>
      render(<UnconnectedOfflineBanner {...props} />);
  });
  it("should render if user is offline", () => {
    const { getByText } = renderComponent({
      isOffline: true,
      apiError: false,
      hasError: true,
    });
    expect(
      getByText(
        "You're currently offline and any changes you make won't be saved. Check your connection and try again."
      )
    ).toBeTruthy();
  });

  it("should render if api is offline", () => {
    const { getByText } = renderComponent({
      isOffline: false,
      apiError: true,
      hasError: true,
    });
    expect(
      getByText(
        "We're unable to save your progress right now. Try refreshing the page or try again shortly"
      )
    ).toBeTruthy();
  });

  it("should not render when user and api are online", () => {
    const { queryByText } = renderComponent({
      isOffline: false,
      apiError: false,
      hasError: false,
    });
    expect(
      queryByText(
        "You're currently offline and any changes you make won't be saved. Check your connection and try again."
      )
    ).toBeNull();
    expect(
      queryByText(
        "We're unable to save your progress right now. Try refreshing the page or try again shortly"
      )
    ).toBeNull();
  });

  it("should render with user offline error message when user and api are offline", () => {
    const { getByText } = renderComponent({
      isOffline: true,
      apiError: true,
      hasError: true,
    });
    expect(
      getByText(
        "You're currently offline and any changes you make won't be saved. Check your connection and try again."
      )
    ).toBeTruthy();
  });
});
