import React from "react";
import { shallow } from "enzyme";
import NavLink, { activeClassName } from "./NavLink";
import mountWithRouter from "tests/utils/mountWithRouter";

describe("NavLink", () => {
  let wrapper;

  const props = {
    to: "/page-1",
    title: "Page 1",
    icon: () => <svg />
  };

  beforeEach(() => {
    wrapper = shallow(<NavLink {...props}>Page 1</NavLink>);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should have the active class name when on current page", () => {
    wrapper = mountWithRouter(
      <NavLink {...props} isActive={() => true}>
        Page 1
      </NavLink>
    );

    expect(wrapper.find("a").hasClass(activeClassName)).toBeTruthy();
  });

  it("should not have the active class when not on the current page", () => {
    wrapper = mountWithRouter(
      <NavLink {...props} isActive={() => false}>
        Page 1
      </NavLink>
    );

    expect(wrapper.find("a").hasClass(activeClassName)).toBeFalsy();
  });
});
