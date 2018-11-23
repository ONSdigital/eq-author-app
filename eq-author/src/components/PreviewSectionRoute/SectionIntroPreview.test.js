import React from "react";
import { shallow } from "enzyme";

import SectionIntroPreview from "./SectionIntroPreview";

describe("SectionIntroPreview", () => {
  let section;

  beforeEach(() => {
    section = {
      introductionTitle: "<p>title</p>",
      introductionContent: "<h2>Content</h2>"
    };
  });

  it("should render with all content", () => {
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the title is missing", () => {
    section.introductionTitle = "<p></p>";
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the content is missing", () => {
    section.introductionContent = "<h2></h2>";
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });
});
