import React from "react";
import { shallow, mount } from "enzyme";

import { UnconnectedApp } from "components/App";

const createWrapper = (props = {}, render = shallow) =>
  render(
    <UnconnectedApp {...props}>
      <div>Content</div>
    </UnconnectedApp>
  );

const events = {};
window.addEventListener = jest.fn((event, cb) => {
  events[event] = cb;
});
window.removeEventListener = jest.fn(event => {
  delete events[event];
});

describe("components/App", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      gainConnection: jest.fn(),
      lostConnection: jest.fn()
    };

    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly add online event listener", () => {
    wrapper = createWrapper(props, mount);
    events.online("foo");
    expect(props.gainConnection).toHaveBeenCalledWith("foo");
  });

  it("should correctly add offline event listener", () => {
    wrapper = createWrapper(props, mount);
    events.offline("foo");
    expect(props.lostConnection).toHaveBeenCalledWith("foo");
  });

  it("should correctly remove online event listener", () => {
    wrapper = createWrapper(props, mount);
    wrapper.unmount();
    expect(events.online).toBeUndefined();
  });

  it("should correctly remove offline event listener", () => {
    wrapper = createWrapper(props, mount);
    wrapper.unmount();
    expect(events.online).toBeUndefined();
  });
});
