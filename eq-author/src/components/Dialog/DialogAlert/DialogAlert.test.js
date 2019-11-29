import React from "react";
import { render } from "tests/utils/rtl";
import { DialogAlertList, DialogAlert } from "./";

describe("components/Modal/DialogAlert", () => {
  it("should render an alert", () => {
    const { getByText } = render(
      <DialogAlertList>
        <DialogAlert>This is an alert</DialogAlert>
        <DialogAlert>This is another alert</DialogAlert>
      </DialogAlertList>
    );
    expect(getByText("This is an alert")).toBeTruthy();
    expect(getByText("This is another alert")).toBeTruthy();
  });
});
