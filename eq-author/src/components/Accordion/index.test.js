import React from "react";
import { shallow } from "enzyme";
import Accordion, { Button, Body } from "./";

describe("Accordion", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Accordion title="foo">Accordion panel</Accordion>);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should open and close accordion", () => {
    expect(wrapper.find(Body).prop("open")).toBeTruthy(); //Open by default

    wrapper.find(Button).simulate("click");
    expect(wrapper.find(Body).prop("open")).toBeFalsy(); //Close

    wrapper.find(Button).simulate("click");
    expect(wrapper.find(Body).prop("open")).toBeTruthy(); //Open
  });
});
