import React from "react";
import { shallow } from "enzyme";
import AnswerTypeSelector from "./";
import AnswerTypeGrid from "./AnswerTypeGrid";
import Popout from "components/Popout";

let component, handleSelect;

describe("components/AnswerTypeSelector", () => {
  beforeEach(() => {
    handleSelect = jest.fn();
    component = shallow(
      <AnswerTypeSelector onSelect={handleSelect} answerCount={0} />
    );
  });

  it("shouldn't render content when closed", () => {
    expect(component).toMatchSnapshot();
  });

  it("should say to add 'another' answer if > 0 answers currently", () => {
    component.setProps({ answerCount: 1 });
    expect(component).toMatchSnapshot();
  });

  it("should render content when open", () => {
    component.setState({ open: true });
    expect(component).toMatchSnapshot();
  });

  it("should invoke callback when element selected", () => {
    component.find(AnswerTypeGrid).simulate("select", "foo");
    expect(handleSelect).toHaveBeenCalledWith("foo");
  });

  it("should update state when Popout opened or closed", () => {
    component.find(Popout).simulate("toggleOpen", true);
    expect(component.state("open")).toBe(true);
  });

  it("should focus on menu once Popout has entered", () => {
    const focusMenuItem = jest.fn();

    component.instance().saveGridRef({ focusMenuItem });
    component.find(Popout).simulate("entered");

    expect(focusMenuItem).toHaveBeenCalled();
  });
});
