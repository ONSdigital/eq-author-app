import React from "react";
import { shallow } from "enzyme";

import { CollapsibleEditor } from "./";

describe("CollapsibleEditor", () => {
  let props;
  beforeEach(() => {
    props = {
      collapsible: { id: "1", title: "title", description: "description" },
      onChangeUpdate: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
      canMoveUp: false,
      canMoveDown: false,
      isMoving: false,
      deleteCollapsible: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<CollapsibleEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should disable buttons whilst moving", () => {
    const wrapper = shallow(
      <CollapsibleEditor {...props} canMoveUp canMoveDown isMoving />
    );
    expect(wrapper.find("[data-test='move-up-btn']").prop("disabled")).toEqual(
      true
    );
    expect(
      wrapper.find("[data-test='move-down-btn']").prop("disabled")
    ).toEqual(true);
    expect(
      wrapper.find("[data-test='delete-collapsible-btn']").prop("disabled")
    ).toEqual(true);
  });

  it("should trigger changeUpdate when description is changed", () => {
    const wrapper = shallow(<CollapsibleEditor {...props} />);
    wrapper
      .find("[label='Description']")
      .simulate("update", { name: "description", value: "description change" });
    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "description",
      value: "description change",
    });
  });

  it("should trigger onMoveUp when move up button is clicked", () => {
    shallow(<CollapsibleEditor {...props} />)
      .find("[data-test='move-up-btn']")
      .simulate("click");

    expect(props.onMoveUp).toHaveBeenCalled();
  });

  it("should disable the move up button when canMoveUp is false", () => {
    expect(
      shallow(<CollapsibleEditor {...props} canMoveUp={false} />)
        .find("[data-test='move-up-btn']")
        .prop("disabled")
    ).toEqual(true);
  });

  it("should trigger onMoveDown when move down button is clicked", () => {
    shallow(<CollapsibleEditor {...props} />)
      .find("[data-test='move-down-btn']")
      .simulate("click");

    expect(props.onMoveDown).toHaveBeenCalled();
  });

  it("should disable the move down button when canMoveDown is false", () => {
    expect(
      shallow(<CollapsibleEditor {...props} canMoveDown={false} />)
        .find("[data-test='move-down-btn']")
        .prop("disabled")
    ).toEqual(true);
  });

  it("should trigger deleteCollapsible when the delete button is clicked", () => {
    shallow(<CollapsibleEditor {...props} />)
      .find("[data-test='delete-collapsible-btn']")
      .simulate("click");

    expect(props.deleteCollapsible).toHaveBeenCalled();
  });

  it("should trigger onChange when the title is changed", () => {
    shallow(<CollapsibleEditor {...props} />)
      .find("[data-test='txt-collapsible-title']")
      .simulate("change", { e: "change" });
    expect(props.onChange).toHaveBeenCalledWith({ e: "change" });
  });

  it("should trigger onUpdate when the title is blurred", () => {
    shallow(<CollapsibleEditor {...props} />)
      .find("[data-test='txt-collapsible-title']")
      .simulate("blur", { e: "blur" });
    expect(props.onUpdate).toHaveBeenCalledWith({ e: "blur" });
  });
});
