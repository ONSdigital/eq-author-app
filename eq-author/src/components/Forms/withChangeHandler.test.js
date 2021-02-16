import React from "react";
import withChangeHandler from "components/Forms/withChangeHandler";
import { shallow } from "enzyme";

describe("withChangeHandler", () => {
  const Input = (props) => <input type="text" {...props} />;
  Input.displayName = "Input";

  const EnhancedInput = withChangeHandler(Input);

  let handleChange;

  beforeEach(() => {
    handleChange = jest.fn();
  });

  it("should set the displayName", () => {
    expect(EnhancedInput.displayName).toEqual("withChangeHandler(Input)");
  });

  it("should handle null 'value' prop", () => {
    const component = shallow(
      <EnhancedInput id="foo" value={null} onChange={handleChange} />
    );

    expect(component.prop("value")).toBe("");
  });

  it("should invoke change handler with name and value", () => {
    const component = shallow(
      <EnhancedInput id="foo" value="1" onChange={handleChange} />
    );

    component.simulate("change", { target: { value: "2" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "foo",
        value: "2",
      })
    );
  });

  it("should handle checkboxes", () => {
    const Checkbox = (props) => <input type="checkbox" {...props} />;
    const EnhancedCheckbox = withChangeHandler(Checkbox);

    const component = shallow(
      <EnhancedCheckbox id="foo" value="1" onChange={handleChange} />
    );

    component.simulate("change", {
      target: {
        type: "checkbox",
        checked: true,
      },
    });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "foo",
        value: true,
      })
    );
  });
});
