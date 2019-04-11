import React from "react";
import { shallow } from "enzyme";
import { omit } from "lodash";

import { Pills, ValidationPills } from "./ValidationPills";

import { PREVIOUS_ANSWER } from "constants/validation-entity-types";

const createWrapper = (props, render = shallow) =>
  render(<ValidationPills {...props} />);

describe("ValidationPills", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      entityType: PREVIOUS_ANSWER,
      onEntityTypeChange: jest.fn(),
      Now: () => <div>Start Date Content</div>,
      PreviousAnswer: () => <div>Previous Answer Content</div>,
      Metadata: () => <div>Metadata Content</div>,
      Custom: () => <div>Previous Answer Content</div>,
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render if missing an option component", () => {
    wrapper = createWrapper(omit(props, "Metadata"));
    expect(wrapper).toMatchSnapshot();
  });

  it("should render previous answer", () => {
    const previousAnswer = wrapper.find(Pills).prop("options")[1];
    expect(shallow(previousAnswer.render())).toMatchSnapshot();
  });

  it("should render metadata", () => {
    const metadata = wrapper.find(Pills).prop("options")[2];
    expect(shallow(metadata.render())).toMatchSnapshot();
  });

  it("should render custom", () => {
    const custom = wrapper.find(Pills).prop("options")[3];
    expect(shallow(custom.render())).toMatchSnapshot();
  });

  it("should render startDate", () => {
    const custom = wrapper.find(Pills).prop("options")[0];
    expect(shallow(custom.render())).toMatchSnapshot();
  });

  it("should correctly handle entity type change", () => {
    const pills = wrapper.find(Pills);
    const value = { foo: "bar" };

    pills.simulate("change", value);
    expect(props.onEntityTypeChange).toHaveBeenCalledWith({
      name: "entityType",
      value,
    });
  });
});
