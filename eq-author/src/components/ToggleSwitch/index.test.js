/* eslint-disable react/no-find-dom-node */
import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import ToggleSwitch, {
  HiddenInput,
  ToggleSwitchBackground
} from "components/ToggleSwitch";

const createWrapper = (props, render = shallow) => {
  return render(<ToggleSwitch {...props} />);
};

describe("ToggleSwitch", () => {
  let handleChange;
  let wrapper;
  let props;
  let focus;

  beforeEach(() => {
    handleChange = jest.fn();

    props = {
      id: "test",
      label: "Test switch",
      name: "test",
      onChange: handleChange,
      checked: false
    };

    focus = jest.fn();

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render checked", () => {
    let wrapper = createWrapper(
      Object.assign({}, props, { id: "toggle-2", checked: true })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a large toggle button", () => {
    let wrapper = createWrapper(
      Object.assign({}, props, { id: "toggle-3", width: 5, height: 2, size: 2 })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when mounted", () => {
    expect(
      createWrapper(
        Object.assign({}, props, { id: "toggle-2", checked: true }),
        mount
      )
    ).toMatchSnapshot();
  });

  it("should render when checked and mounted", () => {
    let wrapper = createWrapper(
      Object.assign({}, props, { id: "toggle-2", checked: true }),
      mount
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a large toggle button when mounted", () => {
    let wrapper = createWrapper(
      Object.assign({}, props, {
        id: "toggle-3",
        width: 5,
        height: 2,
        size: 2
      }),
      mount
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should be possible to change default checked value", () => {
    wrapper = createWrapper(Object.assign({}, props, { checked: true }));
    expect(wrapper.find(HiddenInput).props().checked).toEqual(true);
  });

  it("should invoke onChange when input changed", () => {
    wrapper
      .find(HiddenInput)
      .simulate("change", { target: { name: props.name, checked: true } });
    expect(handleChange).toHaveBeenCalledWith({
      target: {
        name: props.name,
        checked: true
      }
    });
  });

  it("should invoke onChange prop when clicked", () => {
    wrapper = createWrapper(props, mount);
    wrapper.find(ToggleSwitchBackground).simulate("click");
    expect(handleChange).toHaveBeenCalledWith({
      name: props.name,
      value: true
    });
  });

  it("should focus on checkbox when clicking on the toggle button", () => {
    wrapper = createWrapper(props, mount);
    const HiddenCheckboxInput = wrapper.find(HiddenInput).instance();

    const domElement = ReactDOM.findDOMNode(HiddenCheckboxInput);
    domElement.focus = focus;

    wrapper.find(ToggleSwitchBackground).simulate("click");
    expect(domElement.focus).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
