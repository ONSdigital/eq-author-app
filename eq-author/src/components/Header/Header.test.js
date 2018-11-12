import React from "react";
import { shallow } from "enzyme";

describe("components/Header", () => {
  let now;
  let handleSignOut;
  let raiseToast;
  let UnconnectedHeader;
  let StyledUserProfile;

  beforeEach(() => {
    jest.mock("config", () => ({
      REACT_APP_LAUNCH_URL: "http://localhost:4000/launch"
    }));
    const Header = require("components/Header");
    UnconnectedHeader = Header.UnconnectedHeader;
    StyledUserProfile = Header.StyledUserProfile;

    now = Date.now;
    Date.now = () => 1507793425522;

    handleSignOut = jest.fn();

    raiseToast = jest.fn();
  });

  const render = (props = {}) =>
    shallow(
      <UnconnectedHeader
        raiseToast={raiseToast}
        signOutUser={handleSignOut}
        {...props}
      />
    );

  afterEach(() => {
    Date.now = now;
  });

  it("renders correctly ", () => {
    expect(render()).toMatchSnapshot();
  });

  describe("when there is a questionnaire", () => {
    const questionnaire = { id: "1", title: "Questionnaire" };
    let wrapper;

    let tempExecCommand;
    beforeEach(() => {
      wrapper = render({ questionnaire });
      tempExecCommand = document.execCommand;
      document.execCommand = jest.fn();
    });
    afterEach(() => {
      document.execCommand = tempExecCommand;
    });

    it("should render the title", () => {
      const title = wrapper.find('[data-test="questionnaire-title"]');

      expect(title).toHaveLength(1);
      expect(title).toMatchSnapshot();
    });

    it("should render a preview button", () => {
      const previewButton = wrapper.find('[data-test="btn-preview"]');

      expect(previewButton).toHaveLength(1);
      expect(previewButton).toMatchSnapshot();
    });

    it("should render a share button", () => {
      const shareButton = wrapper.find('[data-test="btn-share"]');

      expect(shareButton).toHaveLength(1);
      expect(shareButton).toMatchSnapshot();
    });

    it("should let a user copy", () => {
      wrapper.find('[data-test="btn-share"]').simulate("click");
      expect(document.execCommand).toHaveBeenCalledWith("copy");
    });
  });

  describe("when the user is signed in", () => {
    const user = {
      displayName: "Foo Bar",
      email: "foo@b.ar",
      photoURL: "http://foo.b.ar/photo.jpg"
    };

    it("should render user's profile", () => {
      const wrapper = render({ questionnaire: undefined, user });
      const profile = wrapper.find(StyledUserProfile);

      expect(profile).toHaveLength(1);
      expect(profile).toMatchSnapshot();
    });

    it("should allow user to sign out", () => {
      const wrapper = render({ questionnaire: undefined, user });
      wrapper.find(StyledUserProfile).simulate("signOut");

      expect(handleSignOut).toHaveBeenCalled();
    });
  });
});
