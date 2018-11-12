import React from "react";
import { shallow, mount } from "enzyme";
import {
  Accordion,
  AccordionPanel,
  KEY_CODE_ESCAPE
} from "components/Accordion";

describe("Accordion", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Accordion>Accordion panel</Accordion>);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe("AccordionPanel", () => {
  const createWrapper = (props, render = shallow) => {
    return render(
      <AccordionPanel {...props}>
        <div>Content</div>
      </AccordionPanel>
    );
  };

  let props;
  let wrapper;
  beforeEach(() => {
    props = {
      id: "Answer-1",
      title: "Answer properties"
    };
    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("Accordion panel behaviours", () => {
    let scrollIntoView;

    beforeEach(() => {
      wrapper = createWrapper(props, mount);
      scrollIntoView = jest.fn();
      wrapper.instance().saveRef({ scrollIntoView });
    });

    it("should render title and body panels", () => {
      expect(wrapper).toMatchSnapshot();
    });

    it("should initially be closed", () => {
      expect(wrapper.state("open")).toBe(false);
    });

    it("should be possible to make panel open by default", () => {
      wrapper = createWrapper(Object.assign({}, props, { open: true }));
      expect(wrapper.state("open")).toBe(true);
    });

    it("should change state from closed to open upon clicking the title", () => {
      wrapper.instance().handleTitleClick();
      expect(wrapper.state("open")).toBe(true);
    });

    it("should change state from open to closed upon clicking the title when open", () => {
      wrapper.instance().open();
      wrapper.instance().handleTitleClick();
      expect(wrapper.state("open")).toBe(false);
    });

    it("should close the panel when escape key is pressed", () => {
      wrapper.instance().open();
      wrapper.instance().handleKeyUp({
        keyCode: KEY_CODE_ESCAPE
      });
      expect(wrapper.state("open")).toBe(false);
    });

    it("should scroll the panel into view", () => {
      wrapper.instance().open();

      expect(wrapper.state("open")).toBe(true);
      expect(scrollIntoView).toHaveBeenCalled();
    });
  });
});
