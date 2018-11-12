import React from "react";
import ItemSelect, { Option } from "./ItemSelect";
import { shallow } from "enzyme";
import { times } from "lodash";

describe("PositionModal/ItemSelect", () => {
  const createWrapper = (props = {}, render = shallow) =>
    render(
      <ItemSelect {...props} name="foo">
        {times(5, i => (
          <Option value={String(i)} key={i}>
            {i}
          </Option>
        ))}
      </ItemSelect>
    );

  it("should render", () => {
    const onChange = jest.fn();
    const value = "0";

    const wrapper = createWrapper({ value, onChange });
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it("should call onChange prop on change", () => {
    const onChange = jest.fn();
    const value = "0";

    const wrapper = createWrapper({ value, onChange });

    wrapper
      .dive()
      .find(Option)
      .last()
      .simulate("change", { target: { value: "4" } });

    expect(onChange).toHaveBeenCalledWith({ name: "foo", value: "4" });
  });

  describe("Option", () => {
    const createOption = (props = {}) =>
      shallow(
        <Option
          selected
          id="test"
          value="foo"
          name="bar"
          onChange={jest.fn()}
          {...props}
        >
          bar
        </Option>
      );

    it("should render", () => {
      expect(createOption()).toMatchSnapshot();
    });

    it("should invoke on change handler", () => {
      const onChange = jest.fn();

      const wrapper = createOption({ onChange, id: "change-test" });
      wrapper.find("#change-test").simulate("change");

      expect(onChange).toHaveBeenCalled();
    });
  });
});
