import React from "react";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";

import TestProvider from "tests/utils/TestProvider";

import Reorder, { Segment } from "./";

describe("Reorder", () => {
  jest.useFakeTimers();

  let props;

  beforeEach(() => {
    props = {
      list: [{ id: "1" }, { id: "2" }],
      onMove: jest.fn(),
      children: jest.fn(),
    };
  });

  it("should call moveAnswer with the new index when an answer is moved down", () => {
    shallow(<Reorder {...props} />);
    props.children.mock.calls[0][0].onMoveDown();
    expect(props.onMove).toHaveBeenCalledWith({
      id: "1",
      position: 1,
    });
  });

  it("should call moveAnswer with the new index when an answer is moved up", () => {
    shallow(<Reorder {...props} />);
    props.children.mock.calls[1][0].onMoveUp();
    expect(props.onMove).toHaveBeenCalledWith({
      id: "2",
      position: 0,
    });
  });

  it("should not be able to moved down if its the last in the list", () => {
    shallow(<Reorder {...props} />);
    const itemProps = props.children.mock.calls[1][0];
    expect(itemProps.canMoveDown).toEqual(false);
    expect(itemProps.canMoveUp).toEqual(true);
  });

  it("should not be able to moved up if its the first in the list", () => {
    shallow(<Reorder {...props} />);
    const itemProps = props.children.mock.calls[0][0];
    expect(itemProps.canMoveDown).toEqual(true);
    expect(itemProps.canMoveUp).toEqual(false);
  });

  it("does not blow up when the segment ref is null", () => {
    const wrapper = shallow(<Reorder {...props} />);
    expect(() =>
      wrapper
        .find(Segment)
        .at(0)
        .props()
        .innerRef(null)
    ).not.toThrow();
  });

  it("should get the height of the element to work out how much to transition", () => {
    const wrapper = shallow(<Reorder {...props} />);
    const getBoundingClientRect = jest.fn().mockReturnValue({ height: 1 });
    wrapper
      .find(Segment)
      .at(0)
      .props()
      .innerRef({ getBoundingClientRect });

    expect(getBoundingClientRect).toHaveBeenCalledWith();
  });

  it("should not blow up if we unmount after triggering a move", () => {
    const store = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    props.list = [
      {
        id: "1",
        description: "description",
        guidance: "guidance",
        label: "label",
        type: "Currency",
        __typename: "Answer",
      },
      {
        id: "2",
        description: "description",
        guidance: "guidance",
        label: "label",
        type: "Currency",
        __typename: "Answer",
      },
    ];

    const wrapper = mount(
      <TestProvider reduxProps={{ store }} apolloProps={{ mocks: [] }}>
        <Reorder {...props} />
      </TestProvider>
    );

    act(() => {
      props.children.mock.calls[1][0].onMoveUp();
    });

    act(() => {
      wrapper.unmount();
    });

    act(() => {
      expect(() => jest.runAllTimers()).not.toThrow();
    });
  });

  it("should not re-render until transitioning has finished", () => {
    const store = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    props.list = [
      {
        id: "1",
        description: "description",
        guidance: "guidance",
        label: "label",
        type: "Currency",
        __typename: "Answer",
      },
      {
        id: "2",
        description: "description",
        guidance: "guidance",
        label: "label",
        type: "Currency",
        __typename: "Answer",
      },
    ];

    props.children = jest.fn((props, item) => (
      <div data-test="item">{item.id}</div>
    ));

    const TestComponent = props => (
      <TestProvider reduxProps={{ store }} apolloProps={{ mocks: [] }}>
        <Reorder {...props} />
      </TestProvider>
    );

    const wrapper = mount(<TestComponent {...props} />);

    act(() => {
      props.children.mock.calls[1][0].onMoveUp();
    });

    act(() => {
      wrapper.setProps({
        list: props.list.slice().reverse(),
      });
    });

    expect(
      wrapper
        .find("[data-test='item']")
        .at(1)
        .text()
    ).toEqual("2");

    act(() => {
      jest.runAllTimers();
    });

    act(() => {
      wrapper.mount();
    });

    expect(
      wrapper
        .find("[data-test='item']")
        .at(1)
        .text()
    ).toEqual("1");
  });
});
