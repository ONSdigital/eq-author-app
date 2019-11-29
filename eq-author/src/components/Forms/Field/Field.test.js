import React from "react";
import { render } from "tests/utils/rtl";
import Field from "components/Forms/Field";
import { Label, Input } from "components/Forms";

describe("components/Forms/Field", () => {
  it("should render correctly", () => {
    const { getByText } = render(
      <Field>
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </Field>
    );
    expect(getByText("Name")).toBeTruthy();
  });
});
