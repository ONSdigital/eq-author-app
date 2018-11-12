import React from "react";
import { shallow } from "enzyme";
import UserProfile, { LogoutButton } from "./index";

describe("UserProfile", () => {
  let onSignOut, user;

  beforeEach(() => {
    onSignOut = jest.fn();
    user = {
      displayName: "Foo Bar",
      email: "foo@b.ar",
      photoURL: "http://foo.b.ar/photo.jpg"
    };
  });

  const render = () =>
    shallow(<UserProfile user={user} onSignOut={onSignOut} />);

  it("should render", () => {
    expect(render()).toMatchSnapshot();
  });

  it("should invoke onSignOut when button clicked", () => {
    const wrapper = render();
    wrapper.find(LogoutButton).simulate("click");
    expect(onSignOut).toHaveBeenCalled();
  });
});
