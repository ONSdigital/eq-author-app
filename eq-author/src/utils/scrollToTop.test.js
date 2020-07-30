//Credit https://medium.com/@hello_21915/testing-the-scrolltotop-component-in-react-with-enzyme-and-jest-5342fab570b4

import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

global.scrollTo = jest.fn();

describe("ScrollToTop", () => {
  let wrapper;
  let history;
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop>
          <p>Hi</p>
        </ScrollToTop>
      </MemoryRouter>
    );
    history = wrapper.instance().history;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls window.scrollTo when route changes", () => {
    expect(global.scrollTo).not.toHaveBeenCalled();
    history.push("/new-url");
    expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("it renders children", () => {
    const component = wrapper.find(ScrollToTop);
    expect(component.children().length).toEqual(1);
    expect(component.contains(<p>Hi</p>)).toEqual(true);
  });
});
