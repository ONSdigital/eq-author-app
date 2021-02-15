import React from "react";
import { shallow } from "enzyme";
import styled from "styled-components";

import BaseTabs from ".";

describe("Base Tabs", () => {
  const tabs = [
    { id: 1, title: "Example 1", render: () => <div>Hello 1</div> },
    { id: 2, title: "Example 2", render: () => <div>Hello 2</div> },
    { id: 3, title: "Example 3", render: () => <div>Hello 3</div> },
  ];
  const renderButton = (props, { title }) => <li {...props}>{title}</li>;

  it("should render the basic layout", () => {
    const wrapper = shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabs}
        activeId={1}
        onChange={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow the user to provide their own styled list wrapper and button wrapper", () => {
    const wrapper = shallow(
      <BaseTabs
        TabList={styled.ul`
          list-style: none;
        `}
        buttonRender={(props, { title }) => <li {...props}>{title}</li>}
        tabs={tabs}
        activeId={1}
        onChange={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the active content as defined by the activeId", () => {
    const activeId = 2;
    const wrapper = shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabs}
        activeId={activeId}
        onChange={() => {}}
      />
    );
    const activeContent = wrapper.find(`[aria-labelledby=${activeId}]`);
    expect(activeContent.text()).toEqual(`Hello ${activeId}`);
  });

  it("call onChange with the id of the button clicked", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabs}
        activeId={1}
        onChange={onChange}
      />
    );

    const button = wrapper.find("li[aria-controls=2]");
    button.simulate("click");

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("will not call onChange when the id has not changed", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabs}
        activeId={2}
        onChange={onChange}
      />
    );

    const button = wrapper.find("li[aria-controls=2]");
    button.simulate("click");
    button.simulate("click");
    button.simulate("click");

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("will only call render for the tab being rendered", () => {
    const tabsWithStubbedRender = tabs.map((t) => ({
      ...t,
      render: jest.fn(),
    }));
    shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabsWithStubbedRender}
        activeId={2}
        onChange={() => {}}
      />
    );

    expect(tabsWithStubbedRender[0].render).not.toHaveBeenCalled();
    expect(tabsWithStubbedRender[1].render).toHaveBeenCalledTimes(1);
    expect(tabsWithStubbedRender[2].render).not.toHaveBeenCalled();
  });

  it("will render the first item as selected when no active id is passed", () => {
    const tabsWithStubbedRender = tabs.map((t) => ({
      ...t,
      render: jest.fn(),
    }));
    const wrapper = shallow(
      <BaseTabs
        buttonRender={renderButton}
        tabs={tabsWithStubbedRender}
        onChange={() => {}}
      />
    );
    const selectedTitle = wrapper.find(`li[aria-selected=true]`).text();
    expect(tabsWithStubbedRender[0].render).toHaveBeenCalledTimes(1);
    expect(selectedTitle).toEqual("Example 1");
  });
});
