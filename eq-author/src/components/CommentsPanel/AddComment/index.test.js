import React from "react";
import { render } from "tests/utils/rtl";

import AddComment from "./index";

describe("Adding a comment", () => {
  let onAdd, onCancel;
  beforeEach(() => {
    onAdd = jest.fn();
    onCancel = jest.fn();
  });
  it("Can render", () => {
    const { getByTestId } = render(
      <AddComment onAdd={onAdd} onCancel={onCancel} />
    );
    const form = getByTestId("add-comment");
    expect(form).toBeVisible();
  });
});
