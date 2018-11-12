import React from "react";
import { mount } from "enzyme";
import Field from "components/Forms/Field";
import { Label, Input } from "components/Forms";

let wrapper;

describe("components/Forms/Field", () => {
  beforeEach(() => {
    wrapper = mount(
      <Field>
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </Field>
    );
  });

  it("should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
