import React from "react";
import { mount } from "enzyme";
import Input from "./";
import Theme from "contexts/themeContext";

const defaultValue = "I am some text";

const handleChange = jest.fn();

describe("components-themed/Input", () => {
  describe("Text", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input
            id="text"
            onChange={handleChange}
            defaultValue={defaultValue}
          />
        </Theme>
      );
    });

    it("should render correctly", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should render a text input by default", () => {
      expect(wrapper.find("input").getElement().props.type).toEqual("text");
    });

    it("should pass `defaultValue` prop to component when type=text", () => {
      expect(wrapper.find("input").getElement().props.defaultValue).toEqual(
        defaultValue
      );
    });

    it("should call onChange with appropriate args", () => {
      wrapper.simulate("change", { target: { value: "hello" } });
      expect(handleChange).toHaveBeenCalledWith({
        name: "text",
        value: "hello",
      });
    });
  });

  describe("Checkbox", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input
            id="my-checkbox"
            type="checkbox"
            onChange={handleChange}
            defaultChecked={false}
          />
        </Theme>
      );
    });

    it("should render a checkbox", () => {
      expect(wrapper.find("input").getElement().props.type).toEqual("checkbox");
    });

    it("should pass `defaultChecked` prop to component", () => {
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input type="checkbox" defaultChecked />
        </Theme>
      );
      expect(wrapper.find("input").getElement().props.defaultChecked).toEqual(
        true
      );
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input type="checkbox" defaultChecked={false} />
        </Theme>
      );
      expect(wrapper.find("input").getElement().props.defaultChecked).toEqual(
        false
      );
    });

    it("should call onChange with appropriate args", () => {
      wrapper.simulate("change", {
        target: { type: "checkbox", checked: true },
      });
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "my-checkbox",
          value: true,
        })
      );
    });
  });

  describe("Radio", () => {
    let wrapper;
    let inputElement;

    beforeEach(() => {
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input
            id="my-radio-button"
            variant="radioBox"
            type="radio"
            onChange={handleChange}
            defaultChecked={false}
          />
        </Theme>
      );
    });

    it("should render a radio button", () => {
      inputElement = wrapper.find("input").getElement();
      expect(inputElement.props.type).toEqual("radio");
    });

    it("should pass 'defaultChecked' prop to component", () => {
      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input type="radio" defaultChecked />
        </Theme>
      );
      inputElement = wrapper.find("input").getElement();
      expect(inputElement.props.defaultChecked).toEqual(true);

      wrapper = mount(
        <Theme themeName={"ons"}>
          <Input type="radio" defaultChecked={false} />
        </Theme>
      );
      inputElement = wrapper.find("input").getElement();
      expect(inputElement.props.defaultChecked).toEqual(false);
    });

    it("should call onChange with appropriate args", () => {
      wrapper.simulate("change", {
        target: { type: "radio", value: true },
      });
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "my-radio-button",
          value: true,
        })
      );
    });
  });
});
