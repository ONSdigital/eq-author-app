import React from "react";
import { shallow } from "enzyme";

import { CollapsiblesEditor } from "./";

describe("CollapsiblesEditor", () => {
  let props;
  beforeEach(() => {
    props = {
      collapsibles: [
        {
          id: "1",
          title: "title",
          description: "description",
        },
      ],
      createCollapsible: jest.fn(),
      moveCollapsible: jest.fn(),
      introductionId: "introId",
    };
  });

  it("should render", () => {
    const wrapper = shallow(<CollapsiblesEditor {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the collapsible editor and additional props for the collapsible given", () => {
    const wrapper = shallow(<CollapsiblesEditor {...props} />)
      .find("[data-test='collapsibles-list']")
      .renderProp("children")({ prop1: "1", prop2: 2 }, props.collapsibles[0]);

    expect(wrapper.props()).toMatchObject({
      collapsible: props.collapsibles[0],
      prop1: "1",
      prop2: 2,
    });
  });

  it("should create the collapsible when the add button is clicked", () => {
    shallow(<CollapsiblesEditor {...props} />)
      .find("[data-test='add-collapsible-btn']")
      .simulate("click");

    expect(props.createCollapsible).toHaveBeenCalledWith({
      introductionId: "introId",
    });
  });

  it("should move the collapsible when move is triggered", () => {
    shallow(<CollapsiblesEditor {...props} />)
      .find("[data-test='collapsibles-list']")
      .simulate("move", { id: "1", position: 2 });

    expect(props.moveCollapsible).toHaveBeenCalledWith({
      id: "1",
      position: 2,
    });
  });
});
