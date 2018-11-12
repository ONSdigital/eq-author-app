import React from "react";
import { shallow } from "enzyme";
import Downshift from "downshift";

import { KeySelect } from "components/MetadataTable/Controls";
import { removeUsedKeys } from "components/MetadataTable/Controls/KeySelect";

const render = (props = {}) => shallow(<KeySelect {...props} />);

describe("KeySelect", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      name: "test",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      usedKeys: []
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("correctly handles custom input changes", () => {
    const input = "custom_value";
    wrapper.simulate("stateChange", { inputValue: input });

    expect(wrapper.state("value")).toEqual(input);
    expect(props.onChange).toHaveBeenCalledWith({
      name: props.name,
      value: input
    });
  });

  it("correctly handles selection from list", () => {
    const input = "tx_id";
    wrapper.simulate("stateChange", { selectedItem: { value: input } });

    expect(wrapper.state("value")).toEqual(input);
    expect(props.onChange).toHaveBeenCalledWith({
      name: props.name,
      value: input
    });
  });

  it("allows empty string as input", () => {
    const input = "";
    wrapper.simulate("stateChange", { inputValue: input });

    expect(wrapper.state("value")).toEqual(input);
    expect(props.onChange).toHaveBeenCalledWith({
      name: props.name,
      value: input
    });
  });

  it("correctly calls onUpdate when input blurred", () => {
    const instance = wrapper.instance();
    instance.stateReducer(
      {},
      {
        type: Downshift.stateChangeTypes.blurInput
      }
    );
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it("correctly calls onUpdate when clicking outside of input", () => {
    const instance = wrapper.instance();
    instance.stateReducer(
      {},
      {
        type: Downshift.stateChangeTypes.mouseUp
      }
    );

    expect(props.onUpdate).toHaveBeenCalled();
  });

  it("correctly calls onChange when hitting enter", () => {
    const instance = wrapper.instance();
    instance.stateReducer(
      {},
      {
        type: Downshift.stateChangeTypes.keyDownEnter
      }
    );

    expect(props.onChange).toHaveBeenCalled();
  });

  it("correctly calls onChange when item selected", () => {
    const instance = wrapper.instance();
    const selectedItem = "tx_id";

    instance.stateReducer(
      {},
      {
        type: Downshift.stateChangeTypes.clickItem,
        selectedItem: { value: selectedItem }
      }
    );

    expect(props.onChange).toHaveBeenCalled();
  });

  it("correctly removes used keys", () => {
    const result = removeUsedKeys(["tx_id", "iat"]);
    expect(result).not.toContainEqual({ value: "tx_id" });
    expect(result).not.toContainEqual({ value: "iat" });
  });
});
