import React from "react";
import GuestSignInForm from "./GuestSignInForm";
import { shallow } from "enzyme";

describe("GuestSignInForm", () => {
  it("should render", () => {
    expect(shallow(<GuestSignInForm onSignIn={jest.fn()} />)).toMatchSnapshot();
  });

  it("should invoke callback on sign in", () => {
    const handleSignIn = jest.fn();
    const wrapper = shallow(<GuestSignInForm onSignIn={handleSignIn} />);

    wrapper.simulate("click");

    expect(handleSignIn).toHaveBeenCalled();
  });
});
