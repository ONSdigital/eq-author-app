import React from "react";
import { render } from "tests/utils/rtl";

import { colors } from "constants/theme";
import Tabs from "./";

describe("Modal Content", () => {
  describe("Tabs", () => {
    const props = {
      activeTabId: "1",
      onChange: jest.fn(),
      onClose: jest.fn(),
      title: "Example title",
      navItems: [
        { id: "1", title: "hello", render: () => <div /> },
        { id: "2", title: "world", render: () => <div /> },
      ],
    };

    it("should render", () => {
      const { getByText } = render(<Tabs {...props} />);
      expect(getByText("Example title")).toBeTruthy();
    });

    it("should render items with a title and showing whether it is selected", () => {
      const { getByText } = render(<Tabs {...props} />);
      expect(getByText("hello")).toHaveStyleRule("background", colors.orange);
    });
  });
});
