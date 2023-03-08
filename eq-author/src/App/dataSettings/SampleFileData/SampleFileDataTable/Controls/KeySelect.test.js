import React from "react";
import { shallow, mount } from "enzyme";

import KeySelect, { removeUsedKeys } from "./KeySelect";
import Typeahead from "components/Forms/Typeahead";

const render = (props = {}) => mount(<KeySelect {...props} />);

describe("KeySelect", () => {
  let props, wrapper;
  const callStateChange = (changes) =>
    wrapper.find(Typeahead).prop("onStateChange")(changes);

  const simulateInputBlur = () =>
    wrapper.find("[data-test='key-input']").last().simulate("blur");

  beforeEach(() => {
    props = {
      name: "test",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      usedKeys: [],
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(shallow(<KeySelect {...props} />)).toMatchSnapshot();
  });

  it("correctly handles custom input changes", () => {
    const input = "custom_value";

    callStateChange({ inputValue: input });
    expect(wrapper.state("value")).toEqual(input);

    simulateInputBlur();
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: props.name,
        value: input,
      },
      expect.any(Function)
    );
  });

  it("correctly handles selection from list", () => {
    const input = "tx_id";

    callStateChange({
      inputValue: input,
      selectedItem: { value: input },
    });
    expect(wrapper.state("value")).toEqual(input);

    simulateInputBlur();
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: props.name,
        value: input,
      },
      expect.any(Function)
    );
  });

  it("allows empty string as input", () => {
    const input = "";
    callStateChange({ inputValue: input });

    expect(wrapper.state("value")).toEqual(input);

    simulateInputBlur();
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: props.name,
        value: input,
      },
      expect.any(Function)
    );
  });

  it("cannot enter undesired input", () => {
    const input = "Test Value";

    callStateChange({ inputValue: input });
    expect(wrapper.state("value")).toEqual("");

    simulateInputBlur();
    expect(props.onChange).toHaveBeenCalledWith(
      {
        name: props.name,
        value: "",
      },
      expect.any(Function)
    );
  });

  it("correctly removes used keys", () => {
    const result = removeUsedKeys(["tx_id", "iat"]);
    expect(result).not.toContainEqual({ value: "tx_id" });
    expect(result).not.toContainEqual({ value: "iat" });
  });
});
