import React from "react";
import { shallow } from "enzyme";
import PrivateRoute from "./";

const Component = () => <div />;

describe("PrivateRoute", () => {
  const location = {
    pathname: "/foo"
  };

  const render = (props = {}) =>
    shallow(
      <PrivateRoute component={Component} isSignedIn={false} {...props} />
    );

  it("should render a redirect if not signed in", () => {
    const wrapper = render();
    const renderProp = wrapper.prop("render");

    expect(renderProp({ location })).toMatchSnapshot();
  });

  it("should render the component if signed in", () => {
    const wrapper = render({ isSignedIn: true });
    const renderProp = wrapper.prop("render");

    expect(renderProp({ location })).toMatchSnapshot();
  });
});
