import React from "react";
import { shallow } from "enzyme";
import Typeahead from "components/Typeahead";
import TypeaheadMenu, {
  filterItemsByInputValue
} from "components/Typeahead/TypeaheadMenu";

const apple = { value: "apple" };
const pear = { value: "pear" };
const orange = { value: "orange" };
const strawberry = { value: "strawberry" };
const raspberry = { value: "raspberry" };
const items = [apple, orange, pear, strawberry, raspberry];

window.toJSON = () => ({});

describe("Typeahead", () => {
  let wrapper;

  it("should render", () => {
    wrapper = shallow(<Typeahead onChange={jest.fn()} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change", () => {
    const handleChange = jest.fn();

    wrapper = shallow(<Typeahead onChange={handleChange} />);

    wrapper.simulate("change", apple);
    expect(handleChange).toHaveBeenCalledWith(apple);
    wrapper.simulate("change", orange);
    expect(handleChange).toHaveBeenCalledWith(orange);
  });
});

describe("TypeaheadMenu", () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      items,
      getMenuProps: jest.fn(),
      getItemProps: jest.fn()
    };
  });

  it("should render", () => {
    wrapper = shallow(<TypeaheadMenu {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.getMenuProps).toHaveBeenCalled();
    expect(props.getItemProps).toHaveBeenCalledTimes(items.length);
  });

  it("should handle the currently highlighted item", () => {
    wrapper = shallow(<TypeaheadMenu {...props} highlightedIndex={0} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle the currently selected item", () => {
    const apple = items[2];

    wrapper = shallow(
      <TypeaheadMenu {...props} highlightedIndex={0} selectedItem={apple} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle the menu being open", () => {
    wrapper = shallow(<TypeaheadMenu {...props} openMenu />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should filter the menu items by the value of input", () => {
    expect(filterItemsByInputValue(items, "app")).toEqual([apple]);
    expect(filterItemsByInputValue(items, "berry")).toEqual([
      strawberry,
      raspberry
    ]);
    expect(filterItemsByInputValue(items, "")).toEqual(items);
    expect(filterItemsByInputValue(items, "blah")).toEqual([]);
  });
});
