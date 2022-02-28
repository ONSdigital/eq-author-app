import React from "react";
import { render as rtlRender, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import PasswordInput from ".";
import Theme from "contexts/themeContext";

const handleChange = jest.fn();

describe("components-themed/Input/PasswordInput", () => {
  describe("custom password Input", () => {
    const renderPasswordInput = () =>
      rtlRender(
        <Theme themeName={"ons"}>
          <PasswordInput
            id="password"
            onChange={({ value }) => handleChange(value)}
            data-test="txt-password"
          />
        </Theme>
      );

    beforeEach(() => {});

    it("should render correctly", () => {
      const { getByText } = renderPasswordInput();

      expect(getByText("Password")).toBeTruthy();
      expect(getByText("Show")).toBeTruthy();
    });

    it("should toggle the show/hide button", () => {
      renderPasswordInput();

      userEvent.click(screen.getByText("Show"));
      expect(screen.getByText("Hide")).toBeVisible();
    });

    it("should fire the onChange event", async () => {
      renderPasswordInput();
      const input = screen.getByLabelText("Password");
      await userEvent.type(input, "MyPAssword");
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
