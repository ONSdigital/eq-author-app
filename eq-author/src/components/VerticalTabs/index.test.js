import React from "react";
import VerticalTabs from ".";
import { render } from "tests/utils/rtl";

const defaultProps = {
  cols: 2,
  gutters: true,
  title: "Tabs galore",
};

describe("Vertical tabs", () => {
  const setup = (props) =>
    render(<VerticalTabs {...defaultProps} {...props} />);

  it("should render enabled or disabled tabs per disabled attribute", () => {
    const { queryByText } = setup({
      tabItems: [
        {
          url: "http://www.example.com",
          title: "My Cool Website",
          disabled: false,
          errorCount: 0,
        },
        {
          url: "http://www.example.com",
          title: "My disabled page",
          disabled: true,
          errorCount: 0,
        },
      ],
    });

    expect(queryByText(/My Cool Website/)).toBeTruthy();
    expect(queryByText(/My Cool Website/)).not.toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(queryByText(/My disabled page/)).toBeTruthy();
    expect(queryByText(/My disabled page/)).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("should render error badge iff errorCount > 0", () => {
    const { queryByTestId } = setup({
      tabItems: [
        {
          url: "http://www.example.com",
          title: "ErrorTab",
          disabled: false,
          errorCount: 2,
        },
        {
          url: "http://www.example.com",
          title: "HappyTab",
          disabled: false,
          errorCount: 0,
        },
      ],
    });

    expect(queryByTestId("errorBadge-ErrorTab")).toBeTruthy();
    expect(queryByTestId("errorBadge-HappyTab")).toBeFalsy();
  });
});
