import React from "react";
import { shallow } from "enzyme";
import PanelBody from "components/Accordion/PanelBody";

describe("PanelBody", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <PanelBody id="panel-body-1" labelledBy="panel-title-1" open={false}>
        Panel body
      </PanelBody>
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
