import React from "react";
import { shallow } from "enzyme";

import PillTabs from "./";

const OPTIONS = [
  {
    id: "completion-date",
    title: "Completion date",
    render: () => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum
        dolorum unde, quisquam eum doloribus blanditiis error dolore nisi
        aspernatur sed beatae adipisci? Ullam, consequatur nemo saepe voluptates
        minus, sunt dolore.
      </p>
    ),
  },
  {
    id: "previous-answer",
    title: "Previous answer",
    render: () => (
      <p>
        Pharetra convallis posuere morbi leo urna molestie at elementum eu
        facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam
        donec adipiscing tristique risus nec feugiat in fermentum posuere
      </p>
    ),
  },
  {
    id: "survey-data",
    title: "Survey data",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    ),
  },
  {
    id: "custom",
    title: "Custom",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    ),
  },
];

describe("PillTabs", () => {
  const props = {
    value: "1",
    options: OPTIONS,
    onChange: () => {},
  };

  it("should render base tabs configured as per design", () => {
    const wrapper = shallow(
      <PillTabs value="1" options={OPTIONS} onChange={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the button with title and applying the props", () => {
    const wrapper = shallow(<PillTabs {...props} />);
    const { buttonRender } = wrapper.find("BaseTabs").props();
    expect(
      shallow(buttonRender({ "aria-selected": true }, { title: "Custom" }))
    ).toMatchSnapshot();
  });
});
