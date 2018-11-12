import React from "react";
import GroupedSelect, { textSelect } from "./GroupedSelect";
import { shallow, mount } from "enzyme";

describe("GroupedSelect", () => {
  const groups = [
    {
      label: "foo",
      id: "1",
      options: [
        { label: "a", value: "1" },
        { label: "b", value: "2" },
        { label: "c", value: "3" }
      ]
    },
    {
      label: "bar",
      id: "2",
      options: [
        { label: "d", value: "4" },
        { label: "e", value: "5" },
        { label: "f", value: "6" }
      ]
    }
  ];

  it("renders", () => {
    const wrapper = shallow(
      <GroupedSelect value="1" onChange={jest.fn()} groups={groups} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("passes value on change", () => {
    const handleChange = jest.fn();
    const wrapper = mount(
      <GroupedSelect
        value="1"
        onChange={handleChange}
        groups={groups}
        name="test"
      />
    );

    wrapper.find("select").simulate("change", "1");

    expect(handleChange).toHaveBeenCalledWith({
      value: "1",
      name: "test"
    });
  });

  it("adds a 'Please select' option if no `value` passed", () => {
    const wrapper = mount(
      <GroupedSelect value={null} onChange={jest.fn()} groups={groups} />
    );

    const options = wrapper
      .find("option")
      .filterWhere(option => option.text() === textSelect);

    expect(options.length).toBe(1);
  });
});
