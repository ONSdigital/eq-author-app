import React from "react";
import { shallow } from "enzyme";
import Accordion, { Button, Body, DisplayContent } from "./";

describe("Accordion", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Accordion title="foo">Accordion panel</Accordion>);
  });

  it("should render open", () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Body).dive()).toMatchSnapshot();
    expect(wrapper.find(Button).dive()).toMatchSnapshot();
    expect(wrapper.find(DisplayContent).dive()).toMatchSnapshot();
  });

  it("should render closed", () => {
    wrapper.setState({ open: false });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Body).dive()).toMatchSnapshot();
    expect(wrapper.find(Button).dive()).toMatchSnapshot();
    expect(wrapper.find(DisplayContent).dive()).toMatchSnapshot();
  });

  it("should open and close accordion", () => {
    expect(wrapper.find(Body).prop("open")).toBeTruthy(); //Open by default

    wrapper.find(Button).simulate("click");
    expect(wrapper.find(Body).prop("open")).toBeFalsy(); //Close

    wrapper.find(Button).simulate("click");
    expect(wrapper.find(Body).prop("open")).toBeTruthy(); //Open
  });
});
